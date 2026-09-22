import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GENEROS } from '../utils/bookValidation';

export default function GenreSelect({ value, onChange, error }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Gênero</Text>
      <View style={styles.chipsRow}>
        {GENEROS.map((genero) => {
          const selected = genero === value;
          return (
            <TouchableOpacity
              key={genero}
              style={[styles.chip, selected ? styles.chipSelected : null]}
              onPress={() => onChange(genero)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>
                {genero}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1f2933',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#cbd2d9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#2b6cb0',
    borderColor: '#2b6cb0',
  },
  chipText: {
    fontSize: 13,
    color: '#1f2933',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#fff',
  },
  errorText: {
    color: '#e5484d',
    fontSize: 12,
    marginTop: 2,
  },
});
