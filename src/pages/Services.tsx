import React from "react";
import Navbar from "@/components/Navbar";
import Service1 from "@/components/services/Service1";
import Service2 from "@/components/services/Service2";
import Footer from "@/components/Footer";
const Services = () => {
  return (
    <main className="min-h-screen bg-white">

        <Navbar />
                <br />
        <br />
        <br />
        <Service1 />
        <br />
        <br />
        <br />
        <Service2 />
        <Footer />

    </main>
  );
};
export default Services;
