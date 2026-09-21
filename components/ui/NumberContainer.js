import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

// Exibe um número grande em destaque (palpite ou código encontrado)
function NumberContainer({ children, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.number}>{children}</Text>
    </View>
  );
}

export default NumberContainer;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: Colors.principal,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 28,
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.painelSecundario,
  },
  number: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 48,
    color: Colors.principal,
    textAlign: 'center',
    letterSpacing: 4,
  },
});
