import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../SectionHeader";
import CrystalCard from "../CrystalCard";
import Projectcard from "./Projectcard";

const Works = () => {
  return (
    <div className="w-full px-72">
      <SectionHeader
        title="Works"
        subtitle="A selection of my recent projects."
      />
      <div className="w-full flex flex-col gap-y-3">
        {/* Work items will go here */}
        <Projectcard />
      </div>
    </div>
  );
};

export default Works;
