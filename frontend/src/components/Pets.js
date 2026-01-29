import React, { useState, useEffect } from 'react';
import './Pets.css';

const Pets = () => {
  const [pets, setPets] = useState([]);

  // 펫 타입 정의
  const petTypes = [
    {
      type: 'cat',
      emoji: '🐱',
      name: '고양이',
      speed: 1,
      actions: ['walk', 'sit', 'sleep', 'jump']
    },
    {
      type: 'dog',
      emoji: '🐶',
      name: '강아지',
      speed: 1.5,
      actions: ['walk', 'run', 'sit', 'wag']
    },
    {
      type: 'penguin',
      emoji: '🐧',
      name: '펭귄',
      speed: 0.8,
      actions: ['waddle', 'slide', 'sit', 'wave']
    },
    {
      type: 'robot',
      emoji: '🤖',
      name: '로봇',
      speed: 1.2,
      actions: ['walk', 'beep', 'scan', 'dance']
    }
  ];

  // 초기 펫 생성
  useEffect(() => {
    const initialPets = petTypes.map((petType, index) => ({
      id: index,
      ...petType,
      x: Math.random() * 250, // sidebar 너비
      y: 40 + Math.random() * 150,
      direction: Math.random() > 0.5 ? 'right' : 'left',
      currentAction: 'walk',
      message: null
    }));
    setPets(initialPets);
  }, []);

  // 펫 이동 로직
  useEffect(() => {
    const interval = setInterval(() => {
      setPets(prevPets =>
        prevPets.map(pet => {
          let newX = pet.x;
          let newY = pet.y;
          let newDirection = pet.direction;
          let newAction = pet.currentAction;

          // 랜덤 행동 변경 (3% 확률)
          if (Math.random() < 0.03) {
            newAction = pet.actions[Math.floor(Math.random() * pet.actions.length)];
            
            if (['sit', 'sleep', 'beep', 'scan'].includes(newAction)) {
              setTimeout(() => {
                setPets(prev => 
                  prev.map(p => 
                    p.id === pet.id ? { ...p, currentAction: 'walk' } : p
                  )
                );
              }, 3000);
            }
          }

          // 걷기/뛰기 시 이동
          if (['walk', 'run', 'waddle', 'dance'].includes(newAction)) {
            newX += newDirection === 'right' ? pet.speed : -pet.speed;

            // 박스 경계
            if (newX <= 0) {
              newX = 0;
              newDirection = 'right';
            } else if (newX >= 250) {
              newX = 250;
              newDirection = 'left';
            }

            // Y축 랜덤 이동
            if (Math.random() < 0.02) {
              newY += (Math.random() - 0.5) * 15;
              newY = Math.max(40, Math.min(190, newY));
            }
          }

          return {
            ...pet,
            x: newX,
            y: newY,
            direction: newDirection,
            currentAction: newAction
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // 펫 클릭
  const handlePetClick = (petId) => {
    setPets(prevPets =>
      prevPets.map(pet => {
        if (pet.id === petId) {
          const messages = ['안녕!', '놀자!', '😊', '❤️', '👋', '졸려...'];
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          
          setTimeout(() => {
            setPets(prev => 
              prev.map(p => 
                p.id === petId ? { ...p, message: null } : p
              )
            );
          }, 2000);

          return {
            ...pet,
            message: randomMessage,
            currentAction: 'jump'
          };
        }
        return pet;
      })
    );

    setTimeout(() => {
      setPets(prev => 
        prev.map(p => 
          p.id === petId ? { ...p, currentAction: 'walk' } : p
        )
      );
    }, 500);
  };

  return (
    <div className="sidebar-card pets-card">
      <h3 className="sidebar-title">
        <span className="icon">🐾</span>
        Pets
      </h3>
      <div className="pets-playground">
        {pets.map(pet => (
          <div
            key={pet.id}
            className={`pet pet-${pet.type} pet-${pet.direction} pet-action-${pet.currentAction}`}
            style={{
              left: `${pet.x}px`,
              top: `${pet.y}px`
            }}
            onClick={() => handlePetClick(pet.id)}
          >
            <div className="pet-emoji">{pet.emoji}</div>
            
            {pet.message && (
              <div className="pet-message">
                {pet.message}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pets;