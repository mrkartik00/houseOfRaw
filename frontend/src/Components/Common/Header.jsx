import TopBar from "../Layout/TopBar";
import Navbar from "./Navbar";
import React from "react";

const Header = () => {
    return <header className="border-b border-gray-200">
                <TopBar />
                <Navbar />
    </header>

};

export default Header;