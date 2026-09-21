import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ImageBackground, View, Text, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fontes Google
import {
  Orbitron_400Regular,
  Orbitron_700Bold,
} from '@expo-google-fonts/orbitron';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Telas
import StartGameScreen from './screens/StartGameScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';
import EvilGameScreen from './screens/EvilGameScreen';

// Constantes
import Colors from './constants/Colors';

// Manter splash screen visível enquanto carrega fontes
SplashScreen.preventAutoHideAsync();

const RECORDE_KEY = 'eco_recorde';
const EASTER_EGG_CODES = [67, 42];

export default function App() {
  // Estados globais de navegação
  const [numeroSecreto, setNumeroSecreto] = useState(null);
  const [gameIsOver, setGameIsOver] = useState(false);
  const [totalTentativas, setTotalTentativas] = useState(0);
  const [dificuldade, setDificuldade] = useState('medio');
  const [recorde, setRecorde] = useState(null); // null = sem recorde ainda
  const [novoRecorde, setNovoRecorde] = useState(false);
  const [evilMode, setEvilMode] = useState(false); // Easter egg: modo MAL

  // Carrega fontes personalizadas
  const [fontsLoaded] = useFonts({
    Orbitron_400Regular,
    Orbitron_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  // Carrega recorde salvo do AsyncStorage ao iniciar
  useEffect(() => {
    async function carregarRecorde() {
      try {
        const recordeSalvo = await AsyncStorage.getItem(RECORDE_KEY);
        if (recordeSalvo !== null) {
          setRecorde(parseInt(recordeSalvo));
        }
      } catch (error) {
        console.log('Erro ao carregar recorde:', error);
      }
    }
    carregarRecorde();
  }, []);

  // Esconde splash screen quando fontes carregaram
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Splash screen continua visível
  }

  // Handler: usuário escolheu um número na StartGameScreen
  function pickedNumberHandler(numero, dificuldadeSelecionada) {
    // Easter egg: códigos 67 ou 42 ativam o modo MAL
    if (EASTER_EGG_CODES.includes(numero)) {
      setDificuldade(dificuldadeSelecionada);
      setEvilMode(true);
      setNumeroSecreto(-1); // marcador para indicar jogo ativo
      setGameIsOver(false);

      // Alerta dramático
      Alert.alert(
        '⚠️ ANOMALIA DETECTADA',
        'Código proibido inserido.\n\nA ECO odeia esse número.\nAgora é VOCÊ quem deve adivinhar o código que ela escolheu.\n\nBoa sorte, humano...',
        [{ text: 'ACEITAR DESAFIO', style: 'destructive' }]
      );
      return;
    }

    setNumeroSecreto(numero);
    setDificuldade(dificuldadeSelecionada);
    setEvilMode(false);
    setGameIsOver(false);
  }

  // Handler: jogo terminou (ECO encontrou o código)
  async function gameOverHandler(numTentativas) {
    setGameIsOver(true);
    setTotalTentativas(numTentativas);

    // Verifica e atualiza recorde
    if (recorde === null || numTentativas < recorde) {
      setRecorde(numTentativas);
      setNovoRecorde(true);
      // Salva no AsyncStorage para persistência
      try {
        await AsyncStorage.setItem(RECORDE_KEY, numTentativas.toString());
      } catch (error) {
        console.log('Erro ao salvar recorde:', error);
      }
    } else {
      setNovoRecorde(false);
    }
  }

  // Handler: novo jogo
  function startNewGameHandler() {
    setNumeroSecreto(null);
    setGameIsOver(false);
    setTotalTentativas(0);
    setNovoRecorde(false);
    setEvilMode(false);
  }

  // Navegação por estado — determina qual tela renderizar
  let screen = <StartGameScreen onPickNumber={pickedNumberHandler} />;

  if (numeroSecreto !== null && !gameIsOver && evilMode) {
    // Easter egg: modo MAL — usuário adivinha o número da ECO
    screen = (
      <EvilGameScreen
        dificuldade={dificuldade}
        onGameOver={gameOverHandler}
      />
    );
  } else if (numeroSecreto !== null && !gameIsOver) {
    screen = (
      <GameScreen
        numeroSecreto={numeroSecreto}
        dificuldade={dificuldade}
        onGameOver={gameOverHandler}
      />
    );
  }

  if (gameIsOver) {
    screen = (
      <GameOverScreen
        codigo={evilMode ? '???' : numeroSecreto}
        tentativas={totalTentativas}
        recorde={recorde}
        novoRecorde={novoRecorde}
        onStartNewGame={startNewGameHandler}
      />
    );
  }

  return (
    <View style={styles.rootContainer} onLayout={onLayoutRootView}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.fundo, '#0C1220', Colors.fundo]}
        style={styles.gradientContainer}
      >
        <ImageBackground
          source={require('./assets/images/bg.png')}
          resizeMode="cover"
          style={styles.backgroundImage}
          imageStyle={{ opacity: 0.15 }}
        >
          <View style={styles.safeContainer}>
            {screen}
          </View>
        </ImageBackground>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 20,
  },
});

