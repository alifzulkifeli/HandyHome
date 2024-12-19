import { useEffect, useState } from 'react';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if displayed in standalone mode (universal approach)
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true
    );

    // Listen for the beforeinstallprompt event (Chrome/Android)
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the default browser install banner
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    setDeferredPrompt(null);
  };

  // Show the button only if not standalone and we have a prompt ready
  if (isStandalone || !deferredPrompt) return null;

  return (
    <button onClick={handleInstallClick}>Install App</button>
  );
};

export default InstallButton;
