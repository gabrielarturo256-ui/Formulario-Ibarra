// Banco de preguntas por dificultad (20 por nivel).
// t: tema (norm | keys | qs)
// q: pregunta · o: opciones · a: índice de la correcta · e: explicación
// c: (opcional) esquema o ejemplo que se muestra en un recuadro (solo algunas preguntas)
// Cada partida toma 15 al azar y baraja las opciones.

const QUESTIONS = {
  easy: [
    { t: 'norm', q: '¿Para qué sirve normalizar una base de datos?',
      o: ['Para tener más datos repetidos', 'Para evitar datos repetidos y errores al cambiar o borrar', 'Para borrar tablas', 'Para cifrar contraseñas'], a: 1,
      e: 'Si cada dato se guarda una sola vez, es más fácil mantenerlo correcto.' },

    { t: 'keys', q: '¿Qué es la clave primaria (PK) de una tabla?',
      o: ['La columna que identifica cada fila y no se repite ni queda vacía', 'La columna que enlaza con otra tabla', 'La columna que puede quedar vacía', 'El nombre de la tabla'], a: 0,
      e: 'Es el identificador único de cada fila.',
      c: `CREATE TABLE usuarios (
  id INT PRIMARY KEY,
  nombre VARCHAR(50)
);` },

    { t: 'keys', q: 'En la tabla pedidos, la columna cliente_id guarda el número de un cliente de la tabla clientes. ¿Qué tipo de columna es?',
      o: ['Clave primaria', 'Clave foránea (FK): apunta a un registro de otra tabla', 'Clave natural', 'Un índice'], a: 1,
      e: 'Una FK conecta una fila con un registro de otra tabla.',
      c: `CREATE TABLE pedidos (
  id INT PRIMARY KEY,
  cliente_id INT REFERENCES clientes(id)
);` },

    { t: 'keys', q: '¿Qué es una clave natural?',
      o: ['Un número que inventa el sistema', 'Un dato real que ya identifica algo, como el CURP', 'Un dato que siempre es número', 'Un dato temporal'], a: 1,
      e: 'Es un dato del mundo real, como el CURP o el correo.' },

    { t: 'keys', q: '¿Qué es un ID autoincremental?',
      o: ['Un número que se crea solo, sin significado real', 'El nombre de la persona', 'Su correo electrónico', 'Su RFC'], a: 0,
      e: 'El sistema le asigna 1, 2, 3… y no depende de datos personales.' },

    { t: 'qs', q: 'En QuickSQL, ¿qué significa pk junto a una columna?',
      o: ['Que la columna es de texto', 'Que es la clave primaria', 'Que puede quedar vacía', 'Que es una vista'], a: 1,
      e: 'pk marca la clave primaria.',
      c: `usuarios
--
id int pk
nombre varchar` },

    { t: 'norm', q: 'Una celda con varios teléfonos separados por comas, ¿está bien en una base normalizada?',
      o: ['Sí, es lo más práctico', 'No, cada celda debe tener un solo valor', 'Sí, si son menos de 3', 'No se pueden guardar teléfonos'], a: 1,
      e: 'Cada teléfono debería ir en su propia fila.',
      c: `id | nombre | telefonos
1  | Ana    | 555-1234, 555-9876   ← varios valores en una celda` },

    { t: 'norm', q: 'En una tabla de pedidos, si cambias el nombre de un cliente en una fila pero no en las demás, ¿qué problema aparece?',
      o: ['Datos inconsistentes: la misma persona aparece con dos nombres', 'La tabla se borra sola', 'Se crean más pedidos', 'Ningún problema'], a: 0,
      e: 'Cuando un dato está repetido, hay que cambiarlo en todos lados.',
      c: `pedido | cliente | ciudad
1      | Ana     | Culiacán
2      | Ana     | Mazatlán   ← misma persona, dos ciudades` },

    { t: 'norm', q: '¿Qué ganas al guardar los clientes en su propia tabla?',
      o: ['Cambiar sus datos en un solo lugar', 'Repetir sus datos en cada pedido', 'No tener clave primaria', 'Que la base sea más lenta'], a: 0,
      e: 'Los datos del cliente se actualizan una vez y todos los pedidos lo ven.' },

    { t: 'norm', q: '¿Cómo se llama la primera regla de normalización, la de un solo valor por celda?',
      o: ['1FN (primera forma normal)', '2FN', '3FN', 'Ninguna'], a: 0,
      e: 'La 1FN pide que cada celda tenga un solo valor.' },

    { t: 'keys', q: '¿Por qué un ID es buena clave para una tabla de usuarios?',
      o: ['Porque no cambia aunque cambien sus datos personales', 'Porque es la más larga', 'Porque ocupa más espacio', 'Porque sirve para cifrar'], a: 0,
      e: 'Como no depende de datos personales, no hay que cambiarlo.' },

    { t: 'keys', q: '¿Qué garantiza una clave foránea?',
      o: ['Que el valor exista en la tabla a la que apunta', 'Que la tabla tenga 10 filas', 'Que los datos estén cifrados', 'Que no haya ningún dato vacío'], a: 0,
      e: 'Así no se puede guardar un cliente_id que no exista.' },

    { t: 'keys', q: '¿Qué es un UUID?',
      o: ['Un código aleatorio casi imposible de repetir', 'Un tipo de índice', 'Un nombre de usuario', 'Un lenguaje de consulta'], a: 0,
      e: 'Es un identificador largo generado al azar.' },

    { t: 'norm', q: 'Un dato "atómico" es un dato que:',
      o: ['No se puede dividir en partes más pequeñas útiles', 'Es muy pequeño', 'Está cifrado', 'Aparece en dos tablas'], a: 0,
      e: 'Por ejemplo, la ciudad es atómica; "Culiacán, Sinaloa" no lo es.' },

    { t: 'keys', q: 'Si un alumno puede inscribirse en varios cursos, ¿qué se necesita para identificar cada inscripción?',
      o: ['Solo el nombre del alumno', 'Juntar alumno y curso como clave', 'Solo la fecha', 'Nada, no hace falta'], a: 1,
      e: 'La pareja alumno + curso es única para cada inscripción.' },

    { t: 'qs', q: 'En QuickSQL, ¿qué separa el nombre de la tabla de sus columnas?',
      o: ['--', 'pk', 'int', '>-'], a: 0,
      e: 'La línea de guiones (--) separa el nombre de las columnas.',
      c: `usuarios
--
id int pk` },

    { t: 'norm', q: '¿Qué es una relación uno a muchos?',
      o: ['Un registro de una tabla se relaciona con varios de otra', 'Dos tablas idénticas', 'Una tabla sin claves', 'Un dato repetido en una sola fila'], a: 0,
      e: 'Por ejemplo, un cliente puede tener muchos pedidos.' },

    { t: 'keys', q: '¿Puede una clave foránea quedar vacía?',
      o: ['Sí, si la relación es opcional', 'Nunca', 'Siempre', 'Solo en QuickSQL'], a: 0,
      e: 'Depende de si la relación es obligatoria o no.' },

    { t: 'norm', q: 'Una tabla ya tiene un solo valor por celda (1FN). ¿Qué regla le falta para llegar a 2FN?',
      o: ['Que cada dato dependa de toda la clave, no solo de una parte', 'Que tenga clave foránea', 'Que no tenga nulos', 'Que tenga más de 10 columnas'], a: 0,
      e: 'La 2FN cuida que cada dato pertenezca a la clave completa.' },

    { t: 'keys', q: '¿Qué pasa si una clave natural cambia, por ejemplo un correo?',
      o: ['Hay que actualizarla en todas las tablas que la usan', 'No pasa nada', 'La tabla se borra', 'Se convierte en ID automáticamente'], a: 0,
      e: 'Por eso se prefiere una clave que no cambie.' }
  ],

  normal: [
    { t: 'norm', q: 'En una tabla de inscripciones (alumno, curso, profesor), el profesor depende solo del curso. ¿Qué problema hay?',
      o: ['Dependencia parcial: no cumple 2FN', 'Tiene demasiadas columnas', 'Está bien así', 'Le falta una clave'], a: 0,
      e: 'El profesor depende solo de una parte de la clave, así que conviene sacarlo a una tabla de cursos.',
      c: `inscripciones
alumno | curso | profesor
Ana    | Math  | Ruiz
Luis   | Math  | Ruiz     ← el profesor depende solo del curso` },

    { t: 'norm', q: 'En una tabla de pedidos, la ciudad depende del cliente y no del pedido. ¿Qué forma normal se rompe?',
      o: ['3FN, por dependencia transitiva', '1FN', '2FN', 'BCNF no aplica'], a: 0,
      e: 'La ciudad depende de otro dato que no es la clave: eso es una dependencia transitiva.',
      c: `pedido | cliente | ciudad
1      | Ana     | Culiacán
2      | Ana     | Culiacán   ← la ciudad depende del cliente` },

    { t: 'norm', q: '¿Qué forma normal elimina las dependencias transitivas?',
      o: ['1FN', '2FN', '3FN', 'Ninguna'], a: 2,
      e: 'La 3FN exige que los datos dependan directamente de la clave.' },

    { t: 'norm', q: 'Una tabla está en 3FN, pero una columna que no es clave determina a otra. ¿Hay problema?',
      o: ['Sí, no cumple BCNF', 'No, está perfecta', 'Le falta la 1FN', 'Le sobra una clave primaria'], a: 0,
      e: 'BCNF es más estricta: cada dependencia debe partir de una superclave.' },

    { t: 'keys', q: '¿Qué pasa si el correo de un usuario es su clave primaria y el usuario lo cambia?',
      o: ['Hay que actualizarlo en todas las tablas que lo usan', 'No pasa nada', 'La tabla se borra', 'Se convierte en ID'], a: 0,
      e: 'Por eso se prefiere un ID que no cambie.' },

    { t: 'keys', q: '¿Cómo se llama una clave que identifica filas pero no fue elegida como PK?',
      o: ['Clave alterna (candidata no elegida)', 'Clave foránea', 'Índice agrupado', 'Clave nula'], a: 0,
      e: 'Puede haber varias claves candidatas; solo una es la PK.' },

    { t: 'keys', q: '¿Qué garantiza UNIQUE en una columna?',
      o: ['Que no se repitan valores', 'Que sea la clave primaria', 'Que sea una clave foránea', 'Que nunca tenga vacíos'], a: 0,
      e: 'UNIQUE evita duplicados sin convertir la columna en PK.',
      c: `CREATE TABLE usuarios (
  id INT PRIMARY KEY,
  email VARCHAR(100) UNIQUE
);` },

    { t: 'keys', q: 'Una clave formada por dos columnas, ¿cómo se llama?',
      o: ['Clave compuesta', 'Clave foránea', 'Clave natural', 'Clave cifrada'], a: 0,
      e: 'Se forma combinando dos o más columnas.' },

    { t: 'keys', q: '¿Qué problema tiene usar nombre + fecha de nacimiento como clave?',
      o: ['Dos personas pueden coincidir en ambos datos', 'Son muy largos', 'No se pueden guardar', 'Son números'], a: 0,
      e: 'Dos personas pueden tener el mismo nombre y fecha de nacimiento.' },

    { t: 'keys', q: '¿Por qué conviene nombrar una FK como cliente_id?',
      o: ['Para saber de un vistazo a qué tabla apunta', 'Porque es obligatorio', 'Para cifrarla', 'Para que sea más corta'], a: 0,
      e: 'Un buen nombre hace el diseño más fácil de leer.' },

    { t: 'qs', q: 'En QuickSQL, ¿cómo se indica que user_id apunta a users.id?',
      o: ['user_id int fk >- users.id', 'user_id int ref users', 'FOREIGN users user_id', 'user_id -> users'], a: 0,
      e: 'Se usa fk junto con el símbolo de relación y la columna destino.',
      c: `users
--
id int pk

posts
--
id int pk
user_id int` },

    { t: 'norm', q: '¿Por qué dividir una tabla grande en varias relacionadas?',
      o: ['Para guardar cada dato una vez y mantenerlo fácil', 'Para repetir datos', 'Para quitar las claves', 'Para ocultar información'], a: 0,
      e: 'Cada tipo de información tiene su propia tabla.' },

    { t: 'norm', q: 'Un valor calculado, como total = cantidad × precio, ¿conviene guardarlo en la tabla?',
      o: ['Normalmente no; se puede calcular cuando se necesita', 'Siempre es obligatorio', 'Viola la 1FN', 'Es una clave primaria'], a: 0,
      e: 'Guardarlo puede hacer que quede desactualizado si cambian los datos base.' },

    { t: 'keys', q: 'Si una tabla usa como clave un UUID generado en el celular, ¿qué problema puede dar?',
      o: ['Índices más grandes y menos ordenados', 'No funciona en ningún motor', 'Impide las FK', 'Obliga a usar números negativos'], a: 0,
      e: 'Los valores aleatorios hacen el índice más pesado de mantener.' },

    { t: 'norm', q: '¿Qué es una descomposición sin pérdida?',
      o: ['Al volver a unir las tablas se recupera toda la información', 'Se pierde espacio en disco', 'Se borran los duplicados', 'No hay FK'], a: 0,
      e: 'Separar y volver a unir no debe cambiar los datos originales.' },

    { t: 'qs', q: 'En QuickSQL, ¿qué significa la cardinalidad de una relación?',
      o: ['Cuántos registros de una tabla se relacionan con cuántos de la otra', 'El tamaño del archivo', 'El número de columnas', 'El tipo de índice'], a: 0,
      e: 'Indica si la relación es uno a uno, uno a muchos o muchos a muchos.' },

    { t: 'keys', q: '¿Qué necesita una FK compuesta?',
      o: ['Varias columnas que coinciden con la clave compuesta de la otra tabla', 'Dos tablas a la vez', 'Ser cifrada', 'Ningún requisito'], a: 0,
      e: 'Las columnas deben coincidir en orden y tipo con la clave que referencian.',
      c: `detalle_pedido
pedido_id | linea_id   → debe coincidir con
lineas(pedido_id, linea_id)` },

    { t: 'norm', q: '¿Qué problema trae guardar el mismo dato en muchas filas?',
      o: ['Anomalías: al cambiarlo en una parte puede quedar distinto en otra', 'Ocupa menos espacio', 'Siempre mejora la velocidad', 'No trae problemas'], a: 0,
      e: 'Es la causa de los errores de actualización.' },

    { t: 'keys', q: '¿Qué es una relación muchos a muchos?',
      o: ['Muchos registros de una tabla se relacionan con muchos de otra, y se usa una tabla intermedia', 'Dos tablas idénticas', 'Una tabla sin claves', 'Un dato repetido'], a: 0,
      e: 'Por ejemplo, estudiantes y cursos se unen con una tabla de inscripciones.',
      c: `estudiantes ──┐
              inscripciones (estudiante_id, curso_id)
cursos ───────┘` },

    { t: 'norm', q: '¿Qué forma normal exige que todo determinante sea superclave?',
      o: ['BCNF', '1FN', '2FN', 'Ninguna'], a: 0,
      e: 'BCNF es la versión más estricta de la 3FN.' }
  ],

  hard: [
    { t: 'norm', q: 'En la tabla ventas, producto_id es la clave y proveedor determina el país. ¿Qué forma normal se viola?',
      o: ['1FN', '3FN, por dependencia transitiva', '2FN, porque la clave tiene una columna', 'Ninguna'], a: 1,
      e: 'producto → proveedor → país: el país depende de un dato que no es clave. También se viola BCNF.',
      c: `CREATE TABLE ventas (
  producto_id INT PRIMARY KEY,
  proveedor VARCHAR(50),
  pais_proveedor VARCHAR(50)   -- depende de proveedor
);` },

    { t: 'norm', q: 'En BCNF, todo determinante (lo que decide un dato) debe ser:',
      o: ['Clave foránea', 'Superclave', 'Nulo', 'Índice'], a: 1,
      e: 'Una superclave identifica cada fila por sí sola.' },

    { t: 'norm', q: 'Una tabla tiene clave (A, B), y B determina C, que no es clave. ¿Qué pasa?',
      o: ['Viola 2FN por dependencia parcial', 'Está en 2FN pero no en 3FN', 'Está en BCNF', 'Es correcta'], a: 0,
      e: 'C depende de B, que es solo una parte de la clave.',
      c: `CREATE TABLE tabla_x (
  A INT,
  B INT,
  C VARCHAR(50),
  PRIMARY KEY (A, B)   -- B determina C
);` },

    { t: 'keys', q: '¿Qué es una clave candidata?',
      o: ['Una clave mínima que identifica filas; una se elige como PK', 'Cualquier FK', 'Solo columnas vacías', 'Un índice'], a: 0,
      e: 'Puede haber varias candidatas; la PK es la elegida.' },

    { t: 'keys', q: '¿Por qué una PK compuesta complica las FK de otras tablas?',
      o: ['Hay que copiar varias columnas en la tabla hija', 'El motor no la permite', 'Ocupa menos espacio', 'Impide crear índices'], a: 0,
      e: 'Cada tabla que la referencia debe guardar todas sus columnas.',
      c: `CREATE TABLE detalle (
  pedido_id INT,
  linea_id INT,
  PRIMARY KEY (pedido_id, linea_id)
);` },

    { t: 'keys', q: 'Una tabla de pagos tiene un id autoincremental y un CURP único. ¿Qué diseño es correcto?',
      o: ['id como PK y CURP con UNIQUE', 'CURP como PK sin UNIQUE', 'Eliminar ambos campos', 'CURP como FK hacia la misma tabla'], a: 0,
      e: 'El ID estable es la PK; el CURP se protege con UNIQUE.',
      c: `CREATE TABLE pagos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  curp CHAR(18) UNIQUE,
  monto DECIMAL(10,2)
);` },

    { t: 'qs', q: 'En QuickSQL, ¿cómo se define una tabla?',
      o: ['Con el nombre, una línea de guiones -- y luego las columnas', 'Con CREATE TABLE nombre', 'Con las etiquetas <table>', 'Con nombre: { }'], a: 0,
      e: 'Primero el nombre, luego -- y debajo cada columna con su tipo.',
      c: `usuarios
--
id int pk
nombre varchar` },

    { t: 'qs', q: 'Al procesar un diagrama en QuickSQL, ¿qué obtienes normalmente?',
      o: ['Un diagrama y el script SQL de creación de tablas', 'Solo datos de prueba', 'Una API REST', 'Un PDF de ventas'], a: 0,
      e: 'QuickSQL dibuja el modelo y puede generar el SQL.' },

    { t: 'norm', q: 'Una tabla tiene clave (A, B, C), y A determina D. ¿Qué forma normal se viola?',
      o: ['2FN, por dependencia parcial', '1FN', '3FN, por transitiva', 'BCNF no aplica'], a: 0,
      e: 'A es solo una parte de la clave, así que D depende parcialmente de ella.',
      c: `CREATE TABLE tabla_y (
  A INT,
  B INT,
  C INT,
  D VARCHAR(50),
  PRIMARY KEY (A, B, C)   -- A determina D
);` },

    { t: 'norm', q: 'Una tabla está en 3FN pero no en BCNF. ¿Qué la caracteriza?',
      o: ['Un determinante no es superclave, pero su columna dependiente forma parte de una clave', 'Tiene nulos', 'Tiene claves foráneas', 'Tiene una PK simple'], a: 0,
      e: 'La 3FN tolera este caso porque la columna dependiente es parte de una clave candidata.' },

    { t: 'norm', q: 'Una descomposición sin pérdida significa que:',
      o: ['Al volver a unir las tablas se recupera toda la información', 'No gasta espacio', 'Elimina duplicados', 'No tiene FK'], a: 0,
      e: 'Ningún dato se pierde al separar y unir.' },

    { t: 'norm', q: 'Una descomposición que no preserva dependencias:',
      o: ['Hace difícil validar algunas reglas sin hacer JOIN', 'Siempre es correcta', 'No afecta nada', 'Elimina la PK'], a: 0,
      e: 'Algunas reglas quedan repartidas entre tablas.' },

    { t: 'keys', q: 'Si la PK es un UUID generado en el cliente, ¿qué inconveniente puede haber?',
      o: ['Índices más grandes y dispersos', 'No funciona', 'Impide las FK', 'Obliga a usar negativos'], a: 0,
      e: 'Los valores aleatorios dispersan las inserciones en el índice.' },

    { t: 'keys', q: 'En una relación muchos a muchos, ¿qué se necesita en el modelo relacional?',
      o: ['Una tabla intermedia con las dos FK', 'Una FK repetida en cada tabla', 'Quitar las PK', 'Una vista'], a: 0,
      e: 'La tabla intermedia guarda una fila por cada pareja relacionada.' },

    { t: 'keys', q: 'Una FK tiene ON DELETE CASCADE. Al borrar la fila padre:',
      o: ['Se borran las filas hijas que la referencian', 'Las hijas quedan con FK nula siempre', 'La operación falla siempre', 'Se copia el padre'], a: 0,
      e: 'CASCADE propaga el borrado a las filas que dependen del padre.' },

    { t: 'keys', q: '¿Qué significa que una FK no tenga restricción física en la base?',
      o: ['El motor no valida la relación; la aplicación debe hacerlo', 'No apunta a ninguna tabla', 'Es una PK', 'Está cifrada'], a: 0,
      e: 'Sin restricción, nada impide guardar un valor inexistente.' },

    { t: 'qs', q: 'En QuickSQL, ¿cómo se marca una PK compuesta de dos columnas?',
      o: ['Con pk en cada columna que la forma', 'Con CREATE TABLE', 'Con la palabra compound', 'Con un guion bajo en el nombre'], a: 0,
      e: 'Cada columna de la clave lleva pk.' },

    { t: 'qs', q: 'Antes de dibujar relaciones en QuickSQL, ¿qué conviene hacer?',
      o: ['Identificar qué entidades existen y qué depende de qué', 'Crear índices en todo', 'Poner todo en una sola tabla', 'Elegir el color del diagrama'], a: 0,
      e: 'Un buen modelo nace de entender los datos y sus dependencias.' },

    { t: 'norm', q: 'Una tabla está en 2FN, tiene id como PK, y la dirección depende de cliente_nombre (no es clave). ¿Cuál es el problema?',
      o: ['Dependencia transitiva: no cumple 3FN', 'Dependencia parcial: no cumple 2FN', 'No cumple 1FN', 'No hay problema'], a: 0,
      e: 'cliente_nombre no es clave y determina la dirección: eso es transitiva.',
      c: `pedidos
id | cliente_nombre | direccion
1  | Ana            | Calle 5
2  | Ana            | Calle 5   ← la dirección depende de cliente_nombre` },

    { t: 'keys', q: '¿Qué ventaja tiene una PK sintética (un ID) frente a una natural?',
      o: ['No cambia aunque cambien los datos reales', 'Es más larga', 'Ocupa más espacio', 'Impide las FK'], a: 0,
      e: 'Un ID estable evita actualizar referencias cuando cambia un dato real.' }
  ]
};

// Teoría de repaso que se muestra al final de cada partida
const THEORY = {
  norm: {
    title: 'Normalización',
    points: [
      'Objetivo: guardar cada dato una sola vez para evitar errores al cambiar, insertar o borrar.',
      '1FN: cada celda tiene un solo valor.',
      '2FN: cada dato depende de toda la clave, no solo de una parte.',
      '3FN: cada dato depende directamente de la clave, no de otro dato que no es clave.',
      'BCNF: versión más estricta de la 3FN; todo lo que decide un dato debe ser una superclave.'
    ]
  },
  keys: {
    title: 'Tipos de claves',
    points: [
      'Clave candidata: columnas mínimas que identifican cada fila. Una se elige como PK.',
      'Clave natural: dato real (CURP, correo). Puede cambiar.',
      'Clave ID o surrogada: número o UUID sin significado real. Es estable.',
      'FK: columna que apunta a la PK de otra tabla; mantiene la relación válida.',
      'Clave compuesta: varias columnas juntas identifican una fila.'
    ]
  },
  qs: {
    title: 'QuickSQL',
    points: [
      'Cada tabla empieza con su nombre, seguido de una línea de guiones (--) y sus columnas.',
      'Cada columna se escribe con nombre y tipo, por ejemplo: id int pk.',
      'pk marca la clave primaria; fk marca una clave foránea.',
      'La relación se indica con el símbolo de cardinalidad, por ejemplo: user_id int fk >- users.id.',
      'Al procesar el diagrama se obtiene el modelo visual y el script SQL de creación.'
    ]
  }
};
