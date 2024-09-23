import React from "react";
import { Grid } from "@mui/material";
import singer from "../assets/singer.png";
import dancer from "../assets/dancer.png";
import musician from "../assets/musician.png";
import band from "../assets/band.png";
import entertainer from "../assets/entertainer.png";
import dj from "../assets/dj.png";

const categories = [
  { name: "Singer", image: singer },
  { name: "Dancer", image: dancer },
  { name: "Musician", image: musician },
  { name: "Band", image: band },
  { name: "Entertainer", image: entertainer },
  { name: "DJ", image: dj },
];

export default function Category({ handleClick }) {
  return (
    <div>
      <section className="px-4 py-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Browse By Category</h2>
          <a href="#" className="text-blue-600 hover:underline">
            View All (6)
          </a>
        </div>
        <Grid container spacing={4} className="mt-4">
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <div
                className="bg-white border rounded-lg shadow-md overflow-hidden"
                onClick={() => handleClick(category)}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-40 object-cover"
                />
                <h3 className="text-lg font-semibold text-center mt-2">
                  {category.name}
                </h3>
              </div>
            </Grid>
          ))}
        </Grid>
      </section>
    </div>
  );
}
