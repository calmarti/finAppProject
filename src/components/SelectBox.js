import AsyncSelect from "react-select/async";

export default function SelectBox({options, selected, setKeyword, handleGetSeries}) {

  const filterOptions = (inputValue, setKeyword, options) => {
    setKeyword(inputValue);
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterOptions(inputValue, setKeyword, options));
      }, 1000);
    });

  return (
    <AsyncSelect
      className="async-select"
      autoFocus={true}
      cacheOptions={true} 
      loadOptions={promiseOptions}
      value={selected.symbol}
      onChange={handleGetSeries}
      placeholder="Search a stock..."
    />
  );
}
