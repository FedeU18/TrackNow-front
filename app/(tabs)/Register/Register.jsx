import React, { useState } from 'react';
//import styles from './RegisterStyles';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView 
} from 'react-native';
import { validateRegistrationStep1, validateRegistrationStep2 } from '../../utils/validations';
import useAuthStore from '../../stores/authStore';

export default function Register({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    foto_perfil: "",
    rol: "cliente" // Agregar rol por defecto (por ahora)
  });

  const [error, setError] = useState("");
  
  const { register, isLoading, error: authError, clearError } = useAuthStore();

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value
    });
  };

  const validateStep1 = () => {
    const validation = validateRegistrationStep1(form);
    if (!validation.isValid) {
      setError(validation.message);
      Alert.alert("Error", validation.message);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setError("");
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    setError("");
    clearError();

    // Validación del paso 2
    const validation = validateRegistrationStep2(form);
    if (!validation.isValid) {
      setError(validation.message);
      Alert.alert("Error", validation.message);
      return;
    }

    const result = await register({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      email: form.email.trim(),
      password: form.password,
      telefono: form.telefono.trim(),
      rol: form.rol
    });

    if (result.success) {
      navigation.navigate("Login");
    } else {
      setError(result.error);
      Alert.alert("Error", result.error);
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.title}>Registro</Text>
      <Text style={styles.subtitle}>Paso 1: Información personal</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#9CA3AF"
        value={form.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        placeholderTextColor="#9CA3AF"
        value={form.apellido}
        onChangeText={(text) => handleChange('apellido', text)}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        placeholderTextColor="#9CA3AF"
        value={form.telefono}
        onChangeText={(text) => handleChange('telefono', text)}
        keyboardType="phone-pad"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Volver al menú principal</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.title}>Registro</Text>
      <Text style={styles.subtitle}>Paso 2: Datos de acceso</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#9CA3AF"
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        importantForAutofill="no"
        keyboardType="default"
      />
      
      <View style={styles.passwordRequirements}>
        <Text style={styles.requirementsTitle}>La contraseña debe contener:</Text>
        <Text style={styles.requirementItem}>• Al menos 6 caracteres</Text>
        <Text style={styles.requirementItem}>• Al menos un número</Text>
        <Text style={styles.requirementItem}>• Al menos una letra</Text>
        <Text style={styles.requirementItem}>• Al menos un carácter especial (como ! o &)</Text>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        placeholderTextColor="#9CA3AF"
        value={form.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        importantForAutofill="no"
        keyboardType="default"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={handleBack}>
        <Text style={styles.buttonSecondaryText}>Volver</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Volver al menú principal</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
      keyboardDismissMode="on-drag"
    >
      <View style={styles.formContainer}>
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </View>
    </ScrollView>
  );
}