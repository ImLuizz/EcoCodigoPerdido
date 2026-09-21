import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Colors from '../constants/Colors';
import Title from '../components/ui/Title';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/game/PrimaryButton';
import ButtonsContainer from '../components/ui/ButtonsContainer';
import DifficultySelector, {
  getLimitesDificuldade,
} from '../components/game/DifficultySelector';
import { Ionicons } from '@expo/vector-icons';

function StartGameScreen({ onPickNumber }) {
  const [enteredNumber, setEnteredNumber] = useState('');
  const [dificuldade, setDificuldade] = useState('medio'); // padrão: SISTEMA (1-99)

  const limites = getLimitesDificuldade(dificuldade);

  function numberInputHandler(enteredText) {
    // Permite apenas dígitos
    setEnteredNumber(enteredText.replace(/[^0-9]/g, ''));
  }

  function resetInputHandler() {
    setEnteredNumber('');
  }

  function confirmInputHandler() {
    const chosenNumber = parseInt(enteredNumber);

    if (isNaN(chosenNumber) || chosenNumber <= 0 || chosenNumber > limites.max) {
      Alert.alert(
        'Código inválido',
        `Digite um código dentro do intervalo permitido (1 — ${limites.max}).`,
        [{ text: 'OK', style: 'destructive', onPress: resetInputHandler }]
      );
      return;
    }

    onPickNumber(chosenNumber, dificuldade);
  }

  // maxLength dinâmico baseado na dificuldade
  const maxLength = limites.max.toString().length;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.headerContainer}>
          <Ionicons name="scan-outline" size={48} color={Colors.principal} />
          <Text style={styles.ecoTitle}>ECO</Text>
          <Title>CÓDIGO PERDIDO</Title>
        </View>

        <Card>
          <Text style={styles.description}>
            Uma memória foi apagada.{'\n'}
            Escolha o código que a ECO deverá recuperar.
          </Text>

          <DifficultySelector
            dificuldadeSelecionada={dificuldade}
            onSelect={setDificuldade}
          />

          <Text style={styles.rangeLabel}>
            INTERVALO: {limites.min} — {limites.max}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={enteredNumber}
              onChangeText={numberInputHandler}
              keyboardType="number-pad"
              maxLength={maxLength}
              placeholder="???"
              placeholderTextColor={Colors.textoSecundario}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <ButtonsContainer>
            <View style={styles.buttonWrapper}>
              <PrimaryButton
                onPress={resetInputHandler}
                style={styles.clearButton}
                textStyle={styles.clearButtonText}
              >
                LIMPAR
              </PrimaryButton>
            </View>
            <View style={styles.buttonWrapper}>
              <PrimaryButton onPress={confirmInputHandler}>
                INICIAR RECUPERAÇÃO
              </PrimaryButton>
            </View>
          </ButtonsContainer>
        </Card>

        <View style={styles.footerContainer}>
          <Ionicons name="terminal-outline" size={16} color={Colors.textoSecundario} />
          <Text style={styles.footerText}>
            Sistema ECO v1.0 — Recuperação de Memória
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

export default StartGameScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  ecoTitle: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 52,
    color: Colors.principal,
    letterSpacing: 12,
    marginTop: 8,
    marginBottom: 4,
    textShadowColor: 'rgba(94, 234, 212, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textoSecundario,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  rangeLabel: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 11,
    color: Colors.destaque,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 8,
  },
  inputContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  input: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 36,
    color: Colors.principal,
    borderBottomWidth: 2,
    borderBottomColor: Colors.principal,
    paddingVertical: 8,
    paddingHorizontal: 20,
    textAlign: 'center',
    width: 150,
    letterSpacing: 6,
  },
  buttonWrapper: {
    flex: 1,
  },
  clearButton: {
    backgroundColor: Colors.painelSecundario,
    borderWidth: 1,
    borderColor: Colors.borda,
  },
  clearButtonText: {
    color: Colors.textoSecundario,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textoSecundario,
    letterSpacing: 1,
  },
});
