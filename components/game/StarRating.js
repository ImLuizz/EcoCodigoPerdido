import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

// Sistema de estrelas: 1-5 → ★★★, 6-7 → ★★☆, 8+ → ★☆☆
function StarRating({ tentativas, size = 32 }) {
  let estrelas;
  if (tentativas <= 5) {
    estrelas = 3;
  } else if (tentativas <= 7) {
    estrelas = 2;
  } else {
    estrelas = 1;
  }

  const starsArray = [];
  for (let i = 0; i < 3; i++) {
    starsArray.push(
      <Ionicons
        key={i}
        name={i < estrelas ? 'star' : 'star-outline'}
        size={size}
        color={Colors.alerta}
        style={styles.star}
      />
    );
  }

  return <View style={styles.container}>{starsArray}</View>;
}

export default StarRating;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  star: {
    marginHorizontal: 4,
  },
});
