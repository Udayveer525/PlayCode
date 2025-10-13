import React, { useEffect, useState } from 'react';
import roboImg from "../assets/images/roboFace.png";
import roboHappy from "../assets/images/roboHappy.png";
import roboSad from "../assets/images/roboSad.png";
import roboConfuse from "../assets/images/roboConfuse.png";

export const GameModal = ({ 
  isOpen, 
  type = 'success', // 'success', 'failure', 'info'
  title,
  message,
  onClose,
  actionText = 'Continue',
  onAction 
}) => {
  const [confetti, setConfetti] = useState([]);

  // Generate confetti particles for success
  useEffect(() => {
    if (isOpen && type === 'success') {
      const particles = [];
      for (let i = 0; i < 30; i++) {
        particles.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          color: ['#ff6b6b', '#4ecdc4', '#fdcb6e', '#74b9ff', '#fd79a8'][Math.floor(Math.random() * 5)],
          size: Math.random() * 8 + 4,
          speedX: (Math.random() - 0.5) * 3,
          speedY: Math.random() * 3 + 2,
          rotation: Math.random() * 360
        });
      }
      setConfetti(particles);

      // Animate confetti
      const animateConfetti = () => {
        setConfetti(prev => 
          prev.map(p => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            rotation: p.rotation + 5
          })).filter(p => p.y < 110) // Remove particles that fall off screen
        );
      };

      const interval = setInterval(animateConfetti, 50);
      setTimeout(() => clearInterval(interval), 3000);

      return () => clearInterval(interval);
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const getModalStyles = () => {
    switch (type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, #00b894, #00cec9)',
          borderColor: '#00b894',
          emoji: <img
                    src={roboHappy}
                    alt="Robot Logo"
                    style={{
                      height: "80px",
                      width: "80px",
                    }}
                  />
        };
      case 'failure':
        return {
          background: 'linear-gradient(135deg, #e17055, #fd79a8)',
          borderColor: '#e17055',
          emoji: <img
                    src={roboSad}
                    alt="Robot Logo"
                    style={{
                      height: "80px",
                      width: "80px",
                    }}
                  />
        };
        case 'info':
        return {
          background: 'linear-gradient(135deg, #fdcb6e, #e17055)',
          borderColor: '#fdcb6e',
          emoji: <img
                    src={roboConfuse}
                    alt="Robot Logo"
                    style={{
                      height: "80px",
                      width: "80px",
                    }}
                  />
        };
      default:
        return {
          background: 'linear-gradient(135deg, #74b9ff, #0984e3)',
          borderColor: '#74b9ff',
          emoji: <img
                    src={roboImg}
                    alt="Robot Logo"
                    style={{
                      height: "80px",
                      width: "80px",
                    }}
                  />
        };
    }
  };

  const styles = getModalStyles();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: "'Comic Sans MS', cursive, sans-serif"
    }}>
      {/* Confetti Layer */}
      {type === 'success' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          {confetti.map(particle => (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: particle.color,
                borderRadius: '50%',
                transform: `rotate(${particle.rotation}deg)`,
                transition: 'all 0.05s linear'
              }}
            />
          ))}
        </div>
      )}

      {/* Modal Content */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '25px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        border: `4px solid ${styles.borderColor}`,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'modalBounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        position: 'relative'
      }}>
        {/* Animated Header */}
        <div style={{
          background: styles.background,
          margin: '-40px -40px 30px -40px',
          padding: '25px',
          borderRadius: '25px 25px 0 0',
          color: 'white'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '10px',
            animation: type === 'success' ? 'bounce 1s infinite' : 'none'
          }}>
            {styles.emoji}
          </div>
          <h2 style={{
            margin: 0,
            fontSize: '28px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            {title}
          </h2>
        </div>

        {/* Message */}
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          color: '#2d3436',
          margin: '0 0 30px 0',
          fontWeight: '500'
        }}>
          {message}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={onAction || onClose}
            style={{
              background: styles.background,
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0px)'}
          >
            {actionText} ✨
          </button>

          {onAction && (
            <button
              onClick={onClose}
              style={{
                background: 'rgba(149, 165, 166, 0.2)',
                color: '#636e72',
                border: '2px solid #ddd',
                padding: '15px 30px',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalBounceIn {
          0% { transform: scale(0.3) translateY(-50px); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};
