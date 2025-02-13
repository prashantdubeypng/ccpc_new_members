
document.getElementById('btn1').addEventListener('click',  async function(event){
    event.preventDefault();
    const email = document.getElementById('email').value;
     const password = document.getElementById('password').value;
const name = document.getElementById('name').value;
const phone = document.getElementById('mobile_number').value;
const PreferedLanguage = document.getElementById('language').value;
const Skills = document.getElementById('skills').value;
const reg_no = document.getElementById('reg').value;
const Batch = document.getElementById('Batch').value;

if(!email||!email.includes('@')){
    alert('Please enter a valid email');
    return
}
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone, PreferedLanguage, Skills , reg_no , Batch })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message); // Success message
        } else {
            alert(data.error); // Show error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Try again!');
    }
})

