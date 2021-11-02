// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchFilters, selectAll, setFilterStatus } from "../../reducers/filterReducer";
import { useSelector } from "react-redux";
import Spinner from "../spinner/Spinner";
import classNames from "classnames";

const HeroesFilters = () => {
  const filters = useSelector(selectAll);
  const { activeFilter, filterStatus } = useSelector((state) => state.filters);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFilters());
  }, []);

  if (filterStatus === "loading") return <Spinner />;
  if (filterStatus === "error") {
    <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  const renderFilters = (filters) => {
    if (filters.length === 0) {
      <h5 className="text-center mt-5">Ошибка загрузки</h5>;
    }

    return filters.map(({ label, name, className }) => {
      const btnClass = classNames("btn", className, {
        active: name === activeFilter,
      });

      return (
        <button
          onClick={() => dispatch(setFilterStatus(name))}
          key={name}
          id={name}
          className={btnClass}
        >
          {label}
        </button>
      );
    });
  };

  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        <div className="btn-group">
            {renderFilters(filters)}
        </div>
      </div>
    </div>
  );
};

export default HeroesFilters;
