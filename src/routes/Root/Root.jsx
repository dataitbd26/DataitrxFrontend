import React from 'react';
import { Outlet } from "react-router-dom";
import Header from '../../components/Website/Header';
import Footer from '../../components/Website/Footer';
const Root = () => {
    return (
        <div>
           
        <main>
            <Header></Header>
            <Outlet />
            <Footer></Footer>
        </main>

      
    </div>
    );
};

export default Root;