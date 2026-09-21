import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
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

// Gera palpite inicial com busca binária (sem excluir o número secreto)
function gerarPalpite(min, max) {
  return Math.floor((min + max) / 2);
}

function GameScreen({ numeroSecreto, dificuldade, onGameOver }) {
  const limites = getLimitesDificuldade(dificuldade);

  // Estado dos limites da busca binária
  const minimoRef = useRef(limites.min);
  const maximoRef = useRef(limites.max);

  // Primeiro palpite gerado antes de qualquer alteração nos limites
  const palpiteInicial = gerarPalpite(limites.min, limites.max);

  const [palpiteAtual, setPalpiteAtual] = useState(palpiteInicial);
  const [tentativas, setTentativas] = useState([]);
  const tentativaNumero = useRef(0);

  // Detecta vitória via useEffect
  useEffect(() => {
    if (palpiteAtual === numeroSecreto) {
      // Registra a tentativa final como ENCONTRADO
      tentativaNumero.current += 1;
      setTentativas((prev) => [
        {
          id: tentativaNumero.current.toString(),
          round: tentativaNumero.current,
          guess: palpiteAtual,
          direction: 'ENCONTRADO',
        },
        ...prev,
      ]);

      // Encerra o jogo com o total de tentativas
      // Pequeno delay para permitir o estado atualizar visualmente
      setTimeout(() => {
        onGameOver(tentativaNumero.current);
      }, 600);
    }
  }, [palpiteAtual, numeroSecreto, onGameOver]);

  function nextGuessHandler(direcao) {
    // direcao: 'maior' ou 'menor'

    // GUARDA CONTRA CONTRADIÇÃO — "A ECO não erra"
    if (direcao === 'menor' && numeroSecreto > palpiteAtual) {
      Alert.alert(
        'INFORMAÇÃO INCONSISTENTE',
        'A ECO detectou que essa resposta contradiz o código informado.\n\nA memória não pode ser recuperada com informações falsas.'
      );
      return;
    }

    if (direcao === 'maior' && numeroSecreto < palpiteAtual) {
      Alert.alert(
        'INFORMAÇÃO INCONSISTENTE',
        'A ECO detectou que essa resposta contradiz o código informado.\n\nA memória não pode ser recuperada com informações falsas.'
      );
      return;
    }

    // Registra a tentativa no histórico
    tentativaNumero.current += 1;
    setTentativas((prev) => [
      {
        id: tentativaNumero.current.toString(),
        round: tentativaNumero.current,
        guess: palpiteAtual,
        direction: direcao === 'maior' ? 'MAIOR' : 'MENOR',
      },
      ...prev,
    ]);

    // Atualiza os limites da busca binária
    if (direcao === 'maior') {
      minimoRef.current = palpiteAtual + 1;
    } else {
      maximoRef.current = palpiteAtual - 1;
    }

    // Calcula o novo palpite
    const novoPalpite = gerarPalpite(minimoRef.current, maximoRef.current);
    setPalpiteAtual(novoPalpite);
  }

  // Cálculo para a barra visual do intervalo
  const totalRange = limites.max - limites.min;
  const minPos = totalRange > 0 ? ((minimoRef.current - limites.min) / totalRange) * 100 : 0;
  const maxPos = totalRange > 0 ? ((maximoRef.current - limites.min) / totalRange) * 100 : 100;
  const guessPos = totalRange > 0 ? ((palpiteAtual - limites.min) / totalRange) * 100 : 50;

  const numTentativasDisplay = tentativaNumero.current + 1; // +1 porque a atual ainda não foi registrada

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Ionicons name="search-outline" size={20} color={Colors.principal} />
        <Text style={styles.headerText}>ECO — RECUPERANDO MEMÓRIA</Text>
      </View>

      <Card style={styles.guessCard}>
        <Text style={styles.tentativaLabel}>TENTATIVA #{numTentativasDisplay}</Text>
        <NumberContainer>{palpiteAtual}</NumberContainer>
        <Text style={styles.questionText}>
          O código é maior ou menor que {palpiteAtual}?
        </Text>
        <ButtonsContainer>
          <View style={styles.buttonWrapper}>
            <PrimaryButton
              onPress={() => nextGuessHandler('menor')}
              style={styles.menorButton}
            >
              MENOR ↓
            </PrimaryButton>
          </View>
          <View style={styles.buttonWrapper}>
            <PrimaryButton
              onPress={() => nextGuessHandler('maior')}
              style={styles.maiorButton}
            >
              MAIOR ↑
            </PrimaryButton>
          </View>
        </ButtonsContainer>
      </Card>

      {/* Barra visual do intervalo */}
      <Card style={styles.intervalCard}>
        <Text style={styles.intervalLabel}>INTERVALO ANALISADO</Text>
        <View style={styles.barContainer}>
          {/* Rótulo mínimo */}
          <Text style={styles.barEdgeLabel}>{minimoRef.current}</Text>

          {/* Barra */}
          <View style={styles.barTrack}>
            {/* Parte eliminada esquerda */}
            {minPos > 0 && (
              <View style={[styles.barEliminated, { width: `${minPos}%` }]} />
            )}
            {/* Parte ativa */}
            <View
              style={[
                styles.barActive,
                { left: `${minPos}%`, width: `${Math.max(maxPos - minPos, 1)}%` },
              ]}
            />
            {/* Parte eliminada direita */}
            {maxPos < 100 && (
              <View
                style={[
                  styles.barEliminated,
                  { position: 'absolute', right: 0, width: `${100 - maxPos}%` },
                ]}
              />
            )}
            {/* Marcador do palpite */}
            <View style={[styles.guessMarker, { left: `${guessPos}%` }]}>
              <Text style={styles.markerArrow}>▲</Text>
            </View>
          </View>

          {/* Rótulo máximo */}
          <Text style={styles.barEdgeLabel}>{maximoRef.current}</Text>
        </View>
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
            <Text style={styles.emptyText}>Aguardando primeira resposta...</Text>
          }
        />
      </View>
    </View>
  );
}

export default GameScreen;

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
    color: Colors.principal,
    letterSpacing: 2,
  },
  guessCard: {
    alignItems: 'center',
  },
  tentativaLabel: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 12,
    color: Colors.destaque,
    letterSpacing: 2,
    marginBottom: 4,
  },
  questionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textoSecundario,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  buttonWrapper: {
    flex: 1,
  },
  menorButton: {
    backgroundColor: Colors.erro,
  },
  maiorButton: {
    backgroundColor: Colors.alerta,
  },
  intervalCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  intervalLabel: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 10,
    color: Colors.textoSecundario,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barEdgeLabel: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 12,
    color: Colors.texto,
    width: 36,
    textAlign: 'center',
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.painelSecundario,
    borderRadius: 3,
    position: 'relative',
    overflow: 'visible',
  },
  barActive: {
    position: 'absolute',
    height: 6,
    backgroundColor: Colors.principal,
    borderRadius: 3,
    top: 0,
  },
  barEliminated: {
    height: 6,
    backgroundColor: Colors.borda,
    borderRadius: 3,
  },
  guessMarker: {
    position: 'absolute',
    top: 8,
    marginLeft: -8,
    alignItems: 'center',
  },
  markerArrow: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 12,
    color: Colors.principal,
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
