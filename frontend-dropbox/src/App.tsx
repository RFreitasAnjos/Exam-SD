import './App.css';
import Header from './components/Header';
import SendBar from './components/SendBar';
import Content from './components/Content';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - Fixed at the top */}
      <Header />
      <SendBar />
      <Content />
      <Footer />
    </div>
  );
}

export default App;
