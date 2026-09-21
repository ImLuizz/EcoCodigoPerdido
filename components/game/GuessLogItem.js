import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Item individual do histórico de tentativas
function GuessLogItem({ roundNumber, guess, direction }) {
  // direction: 'MAIOR', 'MENOR' ou 'ENCONTRADO'
  const isFound = direction === 'ENCONTRADO';

  return (
    <View style={[styles.container, isFound && styles.containerFound]}>
      <Text style={styles.roundText}>#{roundNumber}</Text>
      <Text style={[styles.guessText, isFound && styles.guessFound]}>
        {guess}
      </Text>
      <View style={styles.directionContainer}>
        {isFound ? (
          <Ionicons name="checkmark-circle" size={18} color={Colors.sucesso} />
        ) : (
          <Ionicons
            name={direction === 'MAIOR' ? 'arrow-up' : 'arrow-down'}
            size={18}
            color={direction === 'MAIOR' ? Colors.alerta : Colors.erro}
          />
        )}
        <Text
          style={[
            styles.directionText,
            isFound && styles.directionFound,
            direction === 'MAIOR' && styles.directionMaior,
            direction === 'MENOR' && styles.directionMenor,
          ]}
        >
          {direction === 'ENCONTRADO' ? '  ENCONTRADO' : `  ${direction}`}
        </Text>
      </View>
    </View>
  );
}

export default GuessLogItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.painelSecundario,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: Colors.borda,
  },
  containerFound: {
    borderColor: Colors.sucesso,
    backgroundColor: 'rgba(74, 222, 128, 0.08)',
  },
  roundText: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 14,
    color: Colors.textoSecundario,
    width: 40,
  },
  guessText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 18,
    color: Colors.texto,
    width: 60,
    textAlign: 'center',
  },
  guessFound: {
    color: Colors.sucesso,
  },
  directionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    justifyContent: 'flex-end',
  },
  directionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textoSecundario,
    letterSpacing: 1,
  },
  directionFound: {
    color: Colors.sucesso,
  },
  directionMaior: {
    color: Colors.alerta,
  },
  directionMenor: {
    color: Colors.erro,
  },
});
