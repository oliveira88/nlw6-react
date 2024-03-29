import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import logoGoogle from '../assets/images/google-icon.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    } 
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if(!roomCode.trim()) {
      return;
    }
    
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()){
      alert('A sala não existe!')
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }
  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Illustration" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
        <button className="create-room" onClick={handleCreateRoom}>
          <img src={logoGoogle} alt="Logo Google" />
          Crie sua sala com o Google
        </button>
        <div className="separator">ou entre em uma sala</div>
        <form onSubmit={handleJoinRoom}>
          <input 
            type="text"
            placeholder="Digite o código da sala"
            onChange={event => setRoomCode(event.target.value)}
            value={roomCode}
          />
          <Button type="submit">Entrar na sala </Button>
        </form>
        </div>
      </main>
    </div>
  )
}