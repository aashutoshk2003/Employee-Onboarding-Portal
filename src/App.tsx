import { BrowserRouter, Routes, Route } from "react-router-dom";
import Table from './component/table/Table'
import Navbar from './component/navbar/Navbar';
import Home from './component/home/Home';

function App() {
  return (
    <>
      <>
      <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="/table" element={<Table />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
    </>
  );
}

export default App;
