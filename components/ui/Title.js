import { Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

// Componente reutilizável de título — usa props.children obrigatoriamente
function Title({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export default Title;

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 22,
    color: Colors.principal,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.borda,
    paddingBottom: 12,
    marginBottom: 12,
    letterSpacing: 2,
  },
});
