
export const formatDate = (fechaISO) => {

    const date = new Date(fechaISO);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve un índice (0-11), se suma 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
