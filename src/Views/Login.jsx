import { useState } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider, 
  sendEmailVerification
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showResendButton, setShowResendButton] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        if (isSignUp) {
        // Create new account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Send verification email
        await sendEmailVerification(userCredential.user);
        
        alert('Account created! Please check your email to verify your account before logging in.');
        
        // Sign out the user until they verify
        await auth.signOut();
        
        // Switch to login mode
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        
        } else {
        // Sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Check if email is verified
        if (!userCredential.user.emailVerified) {
            alert('Please verify your email before logging in. Check your inbox!');
            await auth.signOut();
            return;
        }
        
        navigate('/');
        }
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
    };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-logo">📘 Glade</h1>
          <p className="login-subtitle">Transform your notes into clear summaries</p>
        </div>

        <div className="login-form">
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          
          {error && <div className="error-message">{error}</div>}

          {/* Google Sign-in Button */}
          <button 
            type="button" 
            className="google-btn" 
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="google-icon"
            />
            Continue with Google
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength="6"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
            </button>
          </form>

          <p className="toggle-text">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              className="toggle-btn"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </p>

          {!isSignUp && (
            <p className="toggle-text">
                Didn't receive verification email?
                <button
                type="button"
                className="toggle-btn"
                onClick={handleResendVerification}
                disabled={loading}
                >
                Resend
                </button>
            </p>
            )}
        </div>
      </div>
    </div>
  );
}

const handleResendVerification = async () => {
  if (!email || !password) {
    setError('Please enter your email and password first');
    return;
  }

  setLoading(true);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    if (userCredential.user.emailVerified) {
      alert('Your email is already verified! You can log in now.');
      await auth.signOut();
      return;
    }

    await sendEmailVerification(userCredential.user);
    alert('Verification email sent! Please check your inbox.');
    await auth.signOut();
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

export default Login;