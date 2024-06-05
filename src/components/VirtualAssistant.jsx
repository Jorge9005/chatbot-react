import React, { useState } from 'react';
import './VirtualAssistant.css';

const VirtualAssistant = () => {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [dataConfirmed, setDataConfirmed] = useState(false);
  const [chatBlocked, setChatBlocked] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Antes de comenzar, por favor revisa nuestro aviso de privacidad.", fromUser: false },
  ]);

  const validateName = (name) => {
    return name.length >= 2;
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleUserInput = (e) => {
    e.preventDefault();
    const input = e.target.elements.userInput.value.trim();
    if (!input) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, fromUser: true },
    ]);

    if (!privacyAccepted) {
      return;
    }

    switch (step) {
      case 0:
        if (validateName(input)) {
          setUserName(input);
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: `Hola ${input}, ¿cuál es tu correo electrónico?`, fromUser: false },
          ]);
          setStep(1);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "Por favor, ingresa un nombre válido (al menos 2 caracteres).", fromUser: false },
          ]);
        }
        break;
      case 1:
        if (validateEmail(input)) {
          setUserEmail(input);
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: `Gracias, ${userName}. Hemos registrado tu correo como ${input}, ${userEmail}.`, fromUser: false },
            { text: "¿Son correctos estos datos?", fromUser: false },
          ]);
          setStep(2);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "Por favor, ingresa un correo electrónico válido.", fromUser: false },
          ]);
        }
        break;
      default:
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Hemos terminado la recolección de datos. Gracias.", fromUser: false },
        ]);
        break;
    }

    e.target.elements.userInput.value = '';
  };

  const handlePrivacyResponse = (accepted) => {
    if (accepted) {
      setPrivacyAccepted(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Gracias por aceptar. ¿Cuál es tu nombre?", fromUser: false },
      ]);
      setStep(0);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Lo siento, necesitas aceptar el aviso de privacidad para continuar.", fromUser: false },
      ]);
    }
  };

  const handleDataConfirmation = (confirmed) => {
    if (confirmed) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Se recopilaron sus datos.", fromUser: false },
      ]);
      setDataConfirmed(true);
      setPrivacyAccepted(false); // Reinicia la aceptación de privacidad
      setChatBlocked(true); // Bloquea el chat
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Por favor, ingresa tu nombre.", fromUser: false },
      ]);
      setStep(0);
    }
  };


  return (
    <div id="chatbox">
      <div id="chatlog">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.fromUser ? 'user-message' : 'bot-message'}
          >
            {msg.text}
          </div>
        ))}
      </div>
      {privacyAccepted && step < 2 ? (
        <form id="chat-form" onSubmit={handleUserInput} disabled={chatBlocked}>
          <input
            type="text"
            id="user-input"
            name="userInput"
            placeholder="Escribe tu mensaje..."
            autoComplete="off"
          />
          <button type="submit">Enviar</button>
        </form>
      ) : (
        <>
          {step === 2 && !dataConfirmed ? (
            <div id="confirmation-buttons">
              <button onClick={() => handleDataConfirmation(true)}>Sí</button>
              <button onClick={() => handleDataConfirmation(false)}>No</button>
            </div>
          ) : null}
          {(!chatBlocked && !privacyAccepted) && (
            <div id="privacy-buttons">
              <button onClick={() => handlePrivacyResponse(true)}>Aceptar</button>
              <button onClick={() => handlePrivacyResponse(false)}>Declinar</button>
            </div>
          )}

        </>
      )}
    </div>
  );

};

export default VirtualAssistant;
