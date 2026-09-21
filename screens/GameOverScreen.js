import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/Colors';
import Title from '../components/ui/Title';
import Card from '../components/ui/Card';
import NumberContainer from '../components/ui/NumberContainer';
import PrimaryButton from '../components/game/PrimaryButton';
import StarRating from '../components/game/StarRating';
import { Ionicons } from '@expo/vector-icons';

function GameOverScreen({
  codigo,
  tentativas,
  recorde,
  novoRecorde,
  onStartNewGame,
}) {
  // Animações
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const checkScaleAnim = useRef(new Animated.Value(0)).current;
  const starsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Vibração/haptic feedback de vitória
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Vibration.vibrate([0, 100, 50, 100]);
    }

    // Sequência de animações
    Animated.sequence([
      // Fade in geral
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Ícone de check aparece com spring
      Animated.spring(checkScaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      // Código expande com spring
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      // Estrelas aparecem
      Animated.spring(starsAnim, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.screen, { opacity: fadeAnim }]}>
      {/* Ícone circular de sucesso */}
      <Animated.View
        style={[
          styles.checkCircle,
          { transform: [{ scale: checkScaleAnim }] },
        ]}
      >
        <Ionicons name="checkmark-sharp" size={48} color={Colors.fundo} />
      </Animated.View>

      <Title>MEMÓRIA RECUPERADA</Title>

      {/* Código encontrado com animação de expansão */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <NumberContainer>{codigo}</NumberContainer>
      </Animated.View>

      <Card style={styles.infoCard}>
        <Text style={styles.infoText}>
          A ECO precisou de
        </Text>
        <Text style={styles.tentativasDestaque}>
          {tentativas} {tentativas === 1 ? 'tentativa' : 'tentativas'}
        </Text>

        {/* Estrelas com animação */}
        <Animated.View style={{ transform: [{ scale: starsAnim }] }}>
          <StarRating tentativas={tentativas} size={36} />
        </Animated.View>
      </Card>

      {/* Recorde */}
      <Card style={styles.recordeCard}>
        {novoRecorde ? (
          <View style={styles.novoRecordeContainer}>
            <Ionicons name="trophy" size={22} color={Colors.alerta} />
            <Text style={styles.novoRecordeText}>NOVO RECORDE!</Text>
          </View>
        ) : null}
        <Text style={styles.recordeLabel}>RECORDE DA SESSÃO</Text>
        <Text style={styles.recordeValor}>
          {recorde} {recorde === 1 ? 'tentativa' : 'tentativas'}
        </Text>
      </Card>

      <View style={styles.buttonContainer}>
        <PrimaryButton onPress={onStartNewGame}>
          NOVA RECUPERAÇÃO
        </PrimaryButton>
      </View>
    </Animated.View>
  );
}

export default GameOverScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.sucesso,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    // overflow hidden para garantir o borderRadius
    overflow: 'hidden',
    // Sombra
    shadowColor: Colors.sucesso,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  infoCard: {
    alignItems: 'center',
    width: '100%',
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textoSecundario,
    textAlign: 'center',
    marginBottom: 4,
  },
  tentativasDestaque: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 22,
    color: Colors.destaque,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
  },
  recordeCard: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.painelSecundario,
  },
  novoRecordeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  novoRecordeText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 16,
    color: Colors.alerta,
    letterSpacing: 2,
  },
  recordeLabel: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 10,
    color: Colors.textoSecundario,
    letterSpacing: 2,
    marginBottom: 4,
  },
  recordeValor: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 18,
    color: Colors.texto,
    letterSpacing: 1,
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
});
