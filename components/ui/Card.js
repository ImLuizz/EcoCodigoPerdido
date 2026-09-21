import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

// Card reutilizável — container com fundo escuro, bordas e sombra
function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.painel,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borda,
    padding: 20,
    marginVertical: 10,
    // Sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    // Sombra Android
    elevation: 6,
  },
});
