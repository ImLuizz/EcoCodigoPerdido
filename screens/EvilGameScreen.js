import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Colors from '../constants/Colors';
import Title from '../components/ui/Title';
import Card from '../components/ui/Card';
import NumberContainer from '../components/ui/NumberContainer';
import PrimaryButton from '../components/game/PrimaryButton';
import ButtonsContainer from '../components/ui/ButtonsContainer';
import GuessLogItem from '../components/game/GuessLogItem';
import { getLimitesDificuldade } from '../components/game/DifficultySelector';
import { Ionicons } from '@expo/vector-icons';

function EvilGameScreen({ dificuldade, onGameOver }) {
  const limites = getLimitesDificuldade(dificuldade);

  // ECO escolhe um número secreto
  const [numeroEco] = useState(() =>
    Math.floor(Math.random() * (limites.max - limites.min + 1)) + limites.min
  );

  const [palpiteUsuario, setPalpiteUsuario] = useState('');
  const [tentativas, setTentativas] = useState([]);
  const [dica, setDica] = useState(null); // 'MAIOR', 'MENOR', ou null
  const tentativaNumero = useRef(0);

  // Animação de glitch no título
  const glitchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação pulsante de "glitch" no header
    Animated.loop(
      Animated.sequence([
        Animated.timing(glitchAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glitchAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const maxLength = limites.max.toString().length;

  function handleGuess() {
    const numero = parseInt(palpiteUsuario);

    if (isNaN(numero) || numero < limites.min || numero > limites.max) {
      Alert.alert(
        'ENTRADA INVÁLIDA',
        `Digite um número entre ${limites.min} e ${limites.max}.`,
        [{ text: 'OK', style: 'destructive' }]
      );
      return;
    }

    tentativaNumero.current += 1;

    if (numero === numeroEco) {
      // Acertou!
      setTentativas((prev) => [
        {
          id: tentativaNumero.current.toString(),
          round: tentativaNumero.current,
          guess: numero,
          direction: 'ENCONTRADO',
        },
        ...prev,
      ]);
      setDica(null);
      setPalpiteUsuario('');

      setTimeout(() => {
        onGameOver(tentativaNumero.current);
      }, 600);
      return;
    }

    // ECO dá dica
    const novaDica = numero < numeroEco ? 'MAIOR' : 'MENOR';
    setDica(novaDica);

    setTentativas((prev) => [
      {
        id: tentativaNumero.current.toString(),
        round: tentativaNumero.current,
        guess: numero,
        direction: novaDica,
      },
      ...prev,
    ]);

    setPalpiteUsuario('');
  }

  const numTentativasDisplay = tentativaNumero.current + 1;

  const headerOpacity = glitchAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.6, 1],
  });

  return (
    <View style={styles.screen}>
      {/* Header com efeito visual de modo MAL */}
      <Animated.View style={[styles.headerRow, { opacity: headerOpacity }]}>
        <Ionicons name="skull-outline" size={22} color={Colors.erro} />
        <Text style={styles.headerText}>ECO — MODO ???</Text>
        <Ionicons name="skull-outline" size={22} color={Colors.erro} />
      </Animated.View>

      <Card style={styles.guessCard}>
        <Text style={styles.evilDescription}>
          A ECO escolheu um código secreto.{'\n'}
          Agora é <Text style={styles.evilHighlight}>VOCÊ</Text> quem deve adivinhar!
        </Text>

        <Text style={styles.tentativaLabel}>TENTATIVA #{numTentativasDisplay}</Text>

        {/* Dica da ECO */}
        {dica && (
          <View style={styles.dicaContainer}>
            <Ionicons
              name={dica === 'MAIOR' ? 'arrow-up-circle' : 'arrow-down-circle'}
              size={24}
              color={dica === 'MAIOR' ? Colors.alerta : Colors.erro}
            />
            <Text style={[
              styles.dicaText,
              { color: dica === 'MAIOR' ? Colors.alerta : Colors.erro }
            ]}>
              A ECO diz: o código é {dica}!
            </Text>
          </View>
        )}

        {!dica && tentativaNumero.current === 0 && (
          <View style={styles.dicaContainer}>
            <Ionicons name="help-circle-outline" size={24} color={Colors.destaque} />
            <Text style={styles.dicaText}>
              Digite seu palpite abaixo...
            </Text>
          </View>
        )}

        {/* Input do usuário */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={palpiteUsuario}
            onChangeText={(text) => setPalpiteUsuario(text.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            maxLength={maxLength}
            placeholder="???"
            placeholderTextColor={Colors.textoSecundario}
            autoCorrect={false}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <PrimaryButton onPress={handleGuess} style={styles.evilButton}>
            ADIVINHAR
          </PrimaryButton>
        </View>
      </Card>

      {/* Intervalo */}
      <Card style={styles.intervalCard}>
        <Text style={styles.intervalLabel}>
          INTERVALO: {limites.min} — {limites.max}
        </Text>
      </Card>

      {/* Histórico de tentativas */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyLabel}>
          <Ionicons name="list-outline" size={14} color={Colors.textoSecundario} />
          {'  HISTÓRICO'}
        </Text>
        <FlatList
          data={tentativas}
          renderItem={({ item }) => (
            <GuessLogItem
              roundNumber={item.round}
              guess={item.guess}
              direction={item.direction}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aguardando seu primeiro palpite...</Text>
          }
        />
      </View>
    </View>
  );
}

export default EvilGameScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 6,
  },
  headerText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 13,
    color: Colors.erro,
    letterSpacing: 2,
  },
  guessCard: {
    alignItems: 'center',
    borderColor: Colors.erro,
    borderWidth: 1,
  },
  evilDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textoSecundario,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  evilHighlight: {
    fontFamily: 'Orbitron_700Bold',
    color: Colors.erro,
    fontSize: 14,
  },
  tentativaLabel: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 12,
    color: Colors.destaque,
    letterSpacing: 2,
    marginBottom: 4,
  },
  dicaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(251, 113, 133, 0.1)',
  },
  dicaText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.destaque,
  },
  inputContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 36,
    color: Colors.erro,
    borderBottomWidth: 2,
    borderBottomColor: Colors.erro,
    paddingVertical: 8,
    paddingHorizontal: 20,
    textAlign: 'center',
    width: 150,
    letterSpacing: 6,
  },
  buttonWrapper: {
    width: '80%',
    marginTop: 4,
  },
  evilButton: {
    backgroundColor: Colors.erro,
  },
  intervalCard: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderColor: Colors.erro,
    borderWidth: 0.5,
  },
  intervalLabel: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 11,
    color: Colors.erro,
    textAlign: 'center',
    letterSpacing: 2,
  },
  historyContainer: {
    flex: 1,
    marginTop: 8,
  },
  historyLabel: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 11,
    color: Colors.textoSecundario,
    letterSpacing: 2,
    marginBottom: 6,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textoSecundario,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
});
