const form = document.getElementById('form')
const password = document.getElementById('password')
const password2 = document.getElementById('password2')
// const form = document.getElementById('form')

const stID = document.URL.split('/')
 const userId = stID[stID.length -1 ]

function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form-control error'
    const small = formControl.querySelector('small') //select any element
    small.innerText = message;
}

function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success'
}

function checkValue(p1, p2) {

    if (p1.value.trim() === '') {
        showError(p1, `${getID(p1)} is Required`)
        return false;
    }
    else
        showSuccess(p1)
    
    if (p2.value.trim() === '') {
        showError(p2, `${getID(p2)} is Required`)    
        return false;
    }
    else
        showSuccess(p2)

    return true;
}

function getID(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

function checkLength(pass ,min,max) {
        const l = pass.value.length;
        if (l < min || l > max) {
            showError(pass, `${getID(pass)} must be between ${min} to ${max} digit`)
            return false;
        }
    return true;
}

checkPassword = (p1, p2) => p1 === p2

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // if (cVal && cLen) {
    //     if (!checkPassword(password.value, password2.value)) {
    //         showError(password, "Password must be match")
    //         showError(password2, "Password must be match")
    //     }
    //     else {
    //         console.log("Ready to go");
    //     }
    // }

  
    if (checkValue(password, password2) &&  checkLength(password, 7, 15)) {
        if (!checkPassword(password.value, password2.value)) {
            showError(password, "Password must be match")
            showError(password2, "Password must be match")
            return;
        }
        else {
            showSuccess(password)
            showSuccess(password2)
            const url = "https://digitalclassroom.herokuapp.com/users/password/reset";
            // const url = "http://localhost:3000/users/password/reset";
            const response = await fetch(url, {  
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify( {
                  "_id" : userId,
                  "password" : password.value
                }),
            })
            if (response.status == 200) {
                alert("Password changed successfully")
                window.location = "https://www.digitalclassroom.ml";
           }
        }
    }
 
   

    // console.log(cVal)
    // console.log(cLen)


        
})