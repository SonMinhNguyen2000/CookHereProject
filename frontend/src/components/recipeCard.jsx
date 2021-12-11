import parse from "html-react-parser";
export default function RecipeCard(props) {
  return (
    <div
      className="card mt-5 shadow ps-5 rounded-3 bg-light md"
      style={{ width: "700px", marginLeft: "50px" }}
    >
      <div className="row no-gutters">
        <div className="col-sm-5 d-flex align-items-center">
          <img className="card-img " src={props.image} alt="recipe card"/>
        </div>
        <div className="col-sm-7">
          <div className="card-body">
            <h5 className="card-title h5 fw-bold">{props.title}</h5>
            <div className="card-text">
              {parse(props.description.substring(0, 200))}...
            </div>
            <div className="card-text">
              <b>Category: {props.category}</b>
            </div>
            <button href="#" className="btn text-light fw-bolder" style={{ backgroundColor: "#F29F05" }}
                    onClick={props.handleClick}>
              Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


