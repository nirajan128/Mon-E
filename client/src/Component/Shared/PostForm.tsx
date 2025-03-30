/* import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"; */
import "../../App.css"

interface PostFormProps{
    title: string;
}
function PostForm(props: PostFormProps){
return <>

<button type="button" className="btn addButton" data-bs-toggle="modal" data-bs-target="#exampleModal">
<i className="fas fa-plus"></i> {props.title}
</button>

<div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        ...
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div></>
};

export default PostForm;