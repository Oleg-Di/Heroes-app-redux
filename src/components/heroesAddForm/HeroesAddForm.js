// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { heroCreated } from "../../reducers/heroesReducer";
import { useSelector } from "react-redux";
import { selectAll } from "../../reducers/filterReducer";

const HeroesAddForm = () => {
  const filters = useSelector(selectAll);
  const filterStatus = useSelector((state) => state.filters.filterStatus);
  const [name, setName] = useState("");
  const [descr, setDescr] = useState("");
  const [element, setElement] = useState("");

  const dispatch = useDispatch();
  const { request } = useHttp();
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const newHero = {
      id: nanoid(),
      name,
      description: descr,
      element,
    };
    request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
      .then((res) => console.log(res))
      .then(dispatch(heroCreated(newHero)))
      .then((err) => console.log(err));
    setName("");
    setDescr("");
    setElement("");
  };
  const renderFilters = (filters, status) => {
    if (status === "loading") {
        return <option>Загрузка элементов</option>
    } else if (status === "error") {
        return <option>Ошибка загрузки</option>
    }
    
    if (filters && filters.length > 0 ) {
        return filters.map(({name, label}) => {
            // eslint-disable-next-line
            if (name === 'all')  return;

            return <option key={name} value={name}>{label}</option>
        })
    }
}

  return (
    <form onSubmit={onSubmitHandler} className="border p-4 shadow-lg rounded">
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Имя нового героя
        </label>
        <input
          required
          type="text"
          name="name"
          className="form-control"
          id="name"
          placeholder="Как меня зовут?"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Описание
        </label>
        <textarea
          required
          name="text"
          className="form-control"
          id="text"
          placeholder="Что я умею?"
          style={{ height: "130px" }}
          value={descr}
          onChange={(e) => setDescr(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Выбрать элемент героя
        </label>
        <select
          required
          className="form-select"
          id="element"
          name="element"
          value={element}
          onChange={(e) => setElement(e.target.value)}
        >
          <option>Я владею элементом...</option>
          {renderFilters(filters, filterStatus)}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Создать
      </button>
    </form>
  );
};

export default HeroesAddForm;
