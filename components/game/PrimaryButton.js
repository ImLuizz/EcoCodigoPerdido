import { View, Text, Pressable, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

// Botão principal reutilizável: View > Pressable > Text
// android_ripple, opacity feedback no iOS, overflow hidden, elevation
function PrimaryButton({ children, onPress, style, textStyle }) {
  return (
    <View style={[styles.outerContainer, style]}>
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
        android_ripple={{ color: Colors.principalEscura }}
      >
        <Text style={[styles.text, textStyle]}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.principal,
    // Sombra iOS
    shadowColor: Colors.principal,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    // Sombra Android
    elevation: 4,
  },
  pressable: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7, // feedback visual no iOS
  },
  text: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 14,
    color: Colors.fundo,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
