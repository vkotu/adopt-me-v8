import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useBreedList from "./useBreedList";
import Results from "./Results";
import fetchSearch from "./fetchSearch";
import AdoptedPetContext from "./AdoptedPetContext";
import { useEffect } from "react";

const ANIMALS = ["bird", "cat", "dog", "rabbit", "reptile"];

const SearchParams = () => {
  const [requestParams, setRequestParams] = useState({
    animal: "",
    location: "",
    breed: "",
    page: 0,
  });
  const [animal, updateAnimal] = useState("");

  const [page, setPage] = useState(0);
  const [isPrevDisabled, setisPrevDisabled] = useState(true);
  useEffect(() => {
    if(page >0 && isPrevDisabled) {
      console.log('set is prev disabled to false')
      setisPrevDisabled(false);
    }
    if(page===0){
      console.log('set is prev disabled to true')
      setisPrevDisabled(true);
    }
  }, [page]);

  const [breeds] = useBreedList(animal);
  const results = useQuery(["search", requestParams], fetchSearch);
  const [adoptedPet] = useContext(AdoptedPetContext);

  const handleNext = () => {
    let p = page + 1;
    setPage(p);
    setRequestParams({
      ...requestParams,
      page: p,
    });
    console.log("next clicked", p);
  };

  const handlePrev = () => {
    let p = page - 1;
    setPage(p);
    setRequestParams({
      ...requestParams,
      page: p,
    });
    console.log("Prev clicked", p);
  };

  if (results.isError) {
    return (
      <div>
        <h1>Oh!no!</h1>
      </div>
    );
  }

  if (results.isLoading) {
    return (
      <div className="loading-pane">
        <h2 className="loader">🌀</h2>
      </div>
    );
  }
  const pets = results?.data?.pets ?? [];
  const isNextDisabled = !results?.data?.hasNext;

  return (
    <div className="search-params">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const obj = {
            animal: formData.get("animal") ?? "",
            breed: formData.get("breed") ?? "",
            location: formData.get("location") ?? "",
            page: 0,
          };
          setRequestParams(obj);
        }}
      >
        {adoptedPet ? (
          <div className="pet image-container">
            <img src={adoptedPet.images[0]} alt={adoptedPet.name} />
          </div>
        ) : null}
        <label htmlFor="location">
          Location
          <input id="location" name="location" placeholder="location"></input>
        </label>
        <label htmlFor="animal">
          Animal
          <select
            id="animal"
            value={animal}
            placeholder="animal"
            onChange={(e) => updateAnimal(e.target.value)}
            onBlur={(e) => {
              updateAnimal(e.target.value);
            }}
          >
            <option />
            {ANIMALS.map((animal) => {
              return (
                <option key={animal} value={animal}>
                  {animal}
                </option>
              );
            })}
          </select>
        </label>
        <label htmlFor="breed">
          Breed
          <select disabled={!breeds.length} id="breed" name="breed">
            <option />
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </label>
        <button>Submit</button>
      </form>

      <div className="pagination">
        <span>
          <button
            style={{ display: "inline-block" }}
            onClick={handlePrev}
            disabled={isPrevDisabled}
          >
            {" "}
            {`<<prev`}{" "}
          </button>
        </span>
        <span>
          <button
            style={{ display: "inline-block" }}
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            {" "}
            {`next>>`}{" "}
          </button>
        </span>
      </div>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
