import React from "react";
import axios from "axios";
import classNames from "classnames";

import "./index.css";

type Image = {
  id: number;
  url: string;
};

type Comment = { id: number; text: string; date: string };

const App: React.FC = () => {
  const [images, setImages] = React.useState<Image[] | null>([]);
  const [visibleModale, setVisibleModale] = React.useState<boolean>(false);
  const [currentImage, setCurrentImage] = React.useState<any>(null);
  const [firstInputValue, setFirstInputValue] = React.useState<string>("");
  const [secondInputValue, setSecondInputValue] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onAddComment = (imageId: number) => {
    const date = new Date();
    if (!firstInputValue && !secondInputValue) {
      alert("Все поля должны быть заполнены");
    } else {
      axios.post(
        "https://boiling-refuge-66454.herokuapp.com/images/" +
          imageId +
          "/commets",
        {
          id: imageId,
          text: firstInputValue,
          date: `${date.getDate()}.${
            date.getMonth() + 1
          }.${date.getFullYear()}`,
        }
      );
      setCurrentImage({
        ...currentImage,
        comments: [
          ...currentImage.comments,
          {
            id: imageId,
            text: secondInputValue,
            date: `${date.getDate()}.${
              date.getMonth() + 1
            }.${date.getFullYear()}`,
          },
        ],
      });
      setFirstInputValue("");
      setSecondInputValue("");
    }
  };

  const onSetVisibleModale = React.useCallback((id: number) => {
    setIsLoading(true);
    axios
      .get("https://boiling-refuge-66454.herokuapp.com/images/" + id)
      .then(({ data }) => setCurrentImage(data))
      .finally(() => {
        setIsLoading(false);
      });
    setVisibleModale(true);
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://boiling-refuge-66454.herokuapp.com/images")
      .then(({ data }) => {
        setImages(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className={classNames("app", { app__modal__active: visibleModale })}>
      <div className="container">
        <div className={classNames({ modal__active: visibleModale })}>
          <h1>Test app</h1>
          {isLoading ? (
            <h2 className="app__load">Загрузка...</h2>
          ) : (
            <div className="app__items">
              {images &&
                images.map((image: Image) => (
                  <div
                    onClick={() => onSetVisibleModale(image.id)}
                    key={image.id}
                    className="app__item"
                  >
                    <img src={image.url} alt="Image" />
                  </div>
                ))}
            </div>
          )}
        </div>
        {visibleModale && currentImage && (
          <div className="app__modal">
            <div className="modal__content">
              {isLoading ? (
                <h2 className="modal__load">Загрузка...</h2>
              ) : (
                <img
                  className="modal__image"
                  src={currentImage.url}
                  alt="Full image"
                />
              )}
              <input
                onChange={(e: any) => setFirstInputValue(e.target.value)}
                value={firstInputValue}
                className="modal__input"
                type="text"
                placeholder="Ваше имя"
              />
              <input
                onChange={(e: any) => setSecondInputValue(e.target.value)}
                value={secondInputValue}
                className="modal__input"
                type="text"
                placeholder="Ваш комменатрий"
              />
              <button
                onClick={() => onAddComment(currentImage.id)}
                className="modal__button"
                type="button"
              >
                Оставить комменатрий
              </button>
            </div>
            <div className="modal__comments">
              {currentImage.comments.map((comment: Comment) => (
                <div key={comment.id} className="comments__item">
                  <p className="comment__data">{comment.date}</p>
                  <p className="comment__text">{comment.text}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setVisibleModale(false)}
              className="modal__close"
            ></button>
          </div>
        )}
        <footer className="footer">
          <p className="footer_text">© 2021</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
