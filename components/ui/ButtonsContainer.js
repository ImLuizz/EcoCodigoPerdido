import { View, StyleSheet } from 'react-native';

// Container para botões lado a lado — usa flexDirection: 'row'
function ButtonsContainer({ children, style }) {
  return <View style={[styles.container, style]}>{children}</View>;
}

export default ButtonsContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 10,
  },
});
