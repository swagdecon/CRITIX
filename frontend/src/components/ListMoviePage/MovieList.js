import { React } from "react";
import MovieList from "../components/ListMoviePage/ListMoviePage";
import NavBar from "../NavBar/NavBar";
export default function MovieListPage() {
  return (
    <div>
      <NavBar />
      <MovieList endpoint={"/movies/popular"} />
    </div>
  );
}
