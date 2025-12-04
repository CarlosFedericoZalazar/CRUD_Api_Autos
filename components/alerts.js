export const alertSucess = (message) =>{
  return Swal.fire({
  position: "center",
  icon: "success",
  title: message,
  showConfirmButton: false,
  timer: 1500
});
};

export const alertConfirm = (title) => {
  return Swal.fire({
    title: title,
    icon: "success",
    draggable: true
  });
};

export const alertError = (msg) => {
  return Swal.fire({
    title: "Error",
    text: msg,
    icon: "error"
  });
};

export const alertDeleteConfirm = (title, text) => {
  return Swal.fire({
  title: title,
  text: text,
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: "Deleted!",
      text: "El registro ha sido eliminado.",
      icon: "success"
    });
  }
  return result;
});
}