function uploadFileClient(file: File, folder: string = 'uploads') {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res  = fetch('/api/image/upload', {
        method: 'POST',
        body:formData,
    })

    if(!res.ok){
        throw new Error('Upload failed');
    }
    return await res.json();
}