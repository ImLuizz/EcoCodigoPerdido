import { View, Text, Pressable, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Dados das dificuldades
const DIFICULDADES = [
  { id: 'facil', nome: 'RECUPERAÇÃO', min: 1, max: 50, icone: 'shield-outline' },
  { id: 'medio', nome: 'SISTEMA', min: 1, max: 99, icone: 'hardware-chip-outline' },
  { id: 'dificil', nome: 'COLAPSO', min: 1, max: 200, icone: 'warning-outline' },
];

// Seletor de dificuldade com 3 opções visuais
function DifficultySelector({ dificuldadeSelecionada, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>MODO DE BUSCA</Text>
      <View style={styles.optionsRow}>
        {DIFICULDADES.map((dif) => {
          const isActive = dificuldadeSelecionada === dif.id;
          return (
            <Pressable
              key={dif.id}
              style={[styles.option, isActive && styles.optionActive]}
              onPress={() => onSelect(dif.id)}
            >
              <Ionicons
                name={dif.icone}
                size={22}
                color={isActive ? Colors.principal : Colors.textoSecundario}
              />
              <Text style={[styles.optionName, isActive && styles.optionNameActive]}>
                {dif.nome}
              </Text>
              <Text style={[styles.optionRange, isActive && styles.optionRangeActive]}>
                {dif.min} — {dif.max}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// Função auxiliar para obter os limites da dificuldade
export function getLimitesDificuldade(dificuldadeId) {
  const dif = DIFICULDADES.find((d) => d.id === dificuldadeId);
  return dif ? { min: dif.min, max: dif.max } : { min: 1, max: 99 };
}

export default DifficultySelector;

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 11,
    color: Colors.textoSecundario,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.borda,
    backgroundColor: Colors.painelSecundario,
  },
  optionActive: {
    borderColor: Colors.principal,
    backgroundColor: 'rgba(94, 234, 212, 0.08)',
  },
  optionName: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 9,
    color: Colors.textoSecundario,
    marginTop: 6,
    letterSpacing: 1,
    textAlign: 'center',
  },
  optionNameActive: {
    color: Colors.principal,
  },
  optionRange: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textoSecundario,
    marginTop: 4,
  },
  optionRangeActive: {
    color: Colors.texto,
  },
});
