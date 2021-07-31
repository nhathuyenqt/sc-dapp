function SinglePost(props) {
    return (
        <div>
            <div>Single Post Page</div>
            <div>Id: {props.id}</div>
            <div>Title: {props.title}</div>
            <div>Description: {props.description}</div>
        </div>
    );
}
export default (SinglePost);