import Header from './components/Header';
import Filters from './components/Filters';
import Footer from './components/Footer';
import "./App.css"
import Particle from './components/Particles';
const App = () => {

  return (
    <div className='filter-data'>
      <Header />
      <div className="container">
        <Particle />
        <Filters />
      </div>
      <Footer />
    </div>
  );
};

export default App;
