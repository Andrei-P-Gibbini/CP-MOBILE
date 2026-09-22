import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import BooksListScreen from '../screens/BooksListScreen';
import BookFormScreen from '../screens/BookFormScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Stack.Screen name="BooksList" component={BooksListScreen} options={{ title: 'Meus livros' }} />
      <Stack.Screen
        name="BookForm"
        component={BookFormScreen}
        options={({ route }) => ({ title: route.params?.livro ? 'Editar livro' : 'Novo livro' })}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}
