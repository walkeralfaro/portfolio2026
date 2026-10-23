# Challenge 01 - Decodificador de Texto con JavaScript 📝

Reto del Bootcamp Alura ONE - G6 2024
- Desarrollado por [Walker Alfaro Trelles](http://walkeralfaro.com) - Lima/Perú
- Link aplicación: [Decodificador](https://walkeralfaro.github.io/alura-challenge-decryptor/)
- Link código: https://github.com/walkeralfaro/alura-challenge-decryptor

## Check List

- [x] Filtra solo letras en minúsculas
- [x] Encripta texto
- [x] Desencripta texto encriptado
- [x] Es responsive
- [x] Tiene botón de copiar texto
- [x] Tiene footer personalizado

## Reto

Las "llaves" de encriptación que utilizaremos son las siguientes:

- `La letra "e" es convertida para "enter"`
- `La letra "i" es convertida para "imes"`
- `La letra "a" es convertida para "ai"`
- `La letra "o" es convertida para "ober"`
- `La letra "u" es convertida para "ufat"`

**Requisitos:**

- Debe funcionar solo con letras minúsculas
- No deben ser utilizados letras con acentos ni caracteres especiales
- Debe ser posible convertir una palabra para la versión encriptada también devolver una palabra encriptada para su versión original.

Por ejemplo:

- `"gato" => "gaitober"`
- `gaitober" => "gato"`

- La página debe tener campos para
  inserción del texto que será encriptado o desencriptado, y el usuario debe poder escoger entre as dos opciones.
- El resultado debe ser mostrado en la pantalla.

**Extras:**

- Un botón que copie el texto encriptado/desencriptado para la sección de transferencia, o sea que tenga la misma funcionalidad del `ctrl+C` o de la opción "copiar" del menú de las aplicaciones.

## Solución 🚀

### Diseño
Con respecto al diseño, he decidido optar por seguir el lineamiento subido a Figma en lugar de diseñar algo propio, con el fin de simular cumplir las necesidades de una hipotética área de UX/UI.

#### Mobile First
Se hizo el diseño completamente ***responsivo***, siguiendo los requirimientos señalados en Figma de distribución espacial de elementos, tamaños, colores, fuentes y proporciones.

Este enfoque planifica el desarrollo desde las dimensiones móviles, en este proyecto se tuvieron tres tamaños de pantalla:

- small screen: 375x933
- tablet screen: 768x1174
- desktop screen: 1440x1024

### Desarrollo

#### Estructura HTML
Iniciar con la esturctura HTML según la totalidad de elementos que posee el wireframe, considerando su utilidad se definen las títulos (h1, h2, h3, etc.), parrafos, inputs, botones, anchors, etc.

Por eso se recomienda hacer el wireframe básico del diseño para reconocer qué elementos se tienen y como se pueden agrupar para planificar los estilos, ya que debe ser responsive, agrupar los elementos en grupos *grid* o *flexbox* es clave.

![structure](https://raw.githubusercontent.com/walkeralfaro/alura-challenge-decryptor/main/screenshots/structure.webp)

### JavaScript
- Se inicializa el script con un `addEventListener` que revise el `DOMContentLoaded` para garantizar que primero se cargue el DOM antes de que se ejecute el script. Es en la función *callback* de `addEventListener` dentro de la cual se ejecuta el resto de nuestro script.

- Una buena práctica es empezar obteniendo las referencias de los elementos HTML por medio de algún método propio de JS, en este caso se usa `querySelector()`, este método devuelve un objeto de la clase *Element* con la referencia del elemento HTML.

- Luego se agregan los `addEventListener` de las acciones de los botones y el input del texto.

#### Encrypting

- La solución implementada para encriptar el texto es convertir el texto en un arreglo, con cada leta y espacio como elemento, por ejemplo:

```javascript
let text = 'hola mundo'
const textArray = [...text]
// textArray = ['h', 'o', 'l', 'a', ' ', 'm', 'u', 'n', 'd', 'o']
```

- Se utiliza el operador spread `...` para desestructurar un string en un array con sus letras como elementos. Se hace esto porque es más fácil trabajar con un array por las métodos para arreglos propios de JS.

- En este caso se utiliza el método `foreach`, que es un método para arreglos que itera por cada elemento del array ejecutando una función definida en su *callback*.

- La función de *callback* es un `switch` que por cada vocal la reemplaza por su equivalente según la regla de encriptación:

```javascript
textArray.forEach((letter, index, array) => {
  switch (true) {
    case letter === 'a':
      array[index] = 'ai'
      break;
    case letter === 'e':
      array[index] = 'enter'
      break;
    case letter === 'i':
      array[index] = 'imes'
      break;
    case letter === 'o':
      array[index] = 'ober'
      break;
    case letter === 'u':
      array[index] = 'ufat'
      break;
    default:
      array[index] = letter;
  }
});
```

- Al finalizar la iteración se tendría algo así:

```javascript
// textArray = [ 'h', 'ober', l, 'ai', ' ', 'm', 'ufat', 'n', 'd', 'ober']
```

- Que luego es convertido a un string con la función `join()`, quedando:

```javascript
const encryptedText = textArray.join('');
// encryptedText = 'hoberlai mufatndober'
```

#### Decrypting

- Para desencriptar utilizamos un enfoque distinto que se basa en reemplazar los terminos ya encriptados, para este fin se utiliza el método `replace()`. Este método puede reemplazar todos los elementos de un string si se pasa como parámetro de búsqueda una expresión regular. Se utilizaría de esta manera:

```javascript
const decryptedText = validationResult.replace(/enter/g, 'e').replace(/imes/g, 'i').replace(/ai/g, 'a').replace(/ober/g, 'o').replace(/ufat/g, 'u');
```

- Se utiliza la expresión regular, por ejemplo: `/enter/g`, en lugar de `enter`, porque esa expresión contiene la bandera `g` que significa *global* y permite hacer el cambio del total de strings *enter* dentro de la cadena original que se quiere desencriptar.

#### Validation

- La validación antes de trabajar con un texto proveniente de un `input` es primordial, ya que no sólo evitamos casos imprevisto de carácteres especiales, sino que evitamos inyección de código, que en un entorno en producción puede ser crítico por la posible filtración de información sensible.

- En nuestro caso se utiliza una expresión regular que sólo permite que se procese en nuestro script texto que sea letras de **a** a la **z**, en minúsculas, y espacios, nada más. Esto se logra con la expresión regular (regex) `/^[a-z\s]+$/`.

- Con el texto filtrado, recién podemos trabajar nuestras funciones de encriptación y desencriptación.

#### Copy

- Se agregó el botón de copiado del texto que fue encriptado o desencriptado. Se utilizó la API de JS que proporciona acceso al portapapeles a través del objeto `navigator.clipboard`. Y es su método `writeText()` el que permite copiar en el portapapeles el texto que se pasa por parámetro.

- Como `navigator.clipboard.writeText()` devuelve una promesa, se puede manejar dentro de una función asíncrona (`async`), que espera que la promesa se resuelva (`await`), pudiendose implementar nuestra función de copiar texto al portapapeles de la siguiente manera:

```javascript
async function copyText(outputText) {
    try {
      await navigator.clipboard.writeText(outputText.textContent);
    } catch (error) {
      prompt('hubo un error al copiar al portapapeles: ', error);
    }
  }
```

- Se resalta que el manejo de una promesa se puede realizar con varios métodos, el elegido es sólo una de muchas formas de manejar el asíncronismo en JS.

### CSS

- Como se mencionó en la sección de **Diseño**, esta se optó por ser *responsive* y empezar el desarrollo teniendo en cuenta el *mobile first*.

- Por ese motivo se pensó en utilizar *flexbox* para organizar nuestro diseño, primero en contenedores y luego en partes más individuales, siendo *flexbox* la que nos permite, de manera sencilla, centrar elementos, manejar su distribución, dirección, espaciado y distribución a medida que el tamaño de la pantalla varía.

- Se respetaron los líneamientos de diseño indicados en Figma, con respecto a margenes, padding, gap, tipo de fuente, colores y tamaño de fuente.

- Adicionalmente se agregó, a criterio propio, un sombreado a los botones, cambio de color de los botones cuando son clicados. También se agregó un *scroll smooth* hacia el texto resultado de la encriptación o desencriptación.

- Se muestra la distribución de elementos en tamaño *mobile*:

![mobile](https://raw.githubusercontent.com/walkeralfaro/alura-challenge-decryptor/main/screenshots/mobile.webp)

- La distribución de elementos en tamaño *desktop*:

![desktop](https://raw.githubusercontent.com/walkeralfaro/alura-challenge-decryptor/main/screenshots/desktop.webp)
