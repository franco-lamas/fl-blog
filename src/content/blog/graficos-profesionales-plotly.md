---
title: "¿Es el diseño de un gráfico importante como su información?"
description: "Cómo crear gráficos profesionales y estéticos con Plotly para análisis de datos financieros."
pubDate: 2024-08-06
author: "Franco Lamas"
category: "python"
tags: ["python", "plotly", "data-analysis", "finanzas"]
image: "/images/2024/plotly-tutorial/1642065646694.png"
---

Creando graficos profesionales con Plotly.

# Creando graficos profesionales con Plotly.

A la hora de hacer análisis de datos, principalmente a la hora de presentar informes, la forma en la que nuestros datos es presentado es tan importante como la calidad de nuestra información.
Tomemos por ejemplo un set de datos con la cotización del Dólar Blue desde 2019 al 2021, importado desde la librería Fallen en Python


![](/images/2024/plotly-tutorial/1642057988570.png)

 Dentro de la librería de pandas, tenemos integrada la función plot() basada en el motor matplotlib, esta función por defecto nos devuelve una imagen super simple, demasiado pequeña y de aspecto visual precario.

![](/images/2024/plotly-tutorial/1642058050111.png)

Si bien implementando varios líneas de código podemos crear un gráfico super estético como se muestra [aquí](https://towardsdatascience.com/cyberpunk-style-with-matplotlib-f47404c9d4c5),  podemos también optar por usar otras librerías que faciliten dicha tarea. Una de esas librerías es Plotly, su mayor ventaja frente a otras es que esta disponible en otros lenguajes de programación como son R o JS, por lo que haciendo pequeñas modificaciones en el código del grafico ya podemos implementarlo en otras plataformas. Un grafico utilizando los valores por defecto de se ve de la siguiente forma:

![](/images/2024/plotly-tutorial/1642058072493.png)

Si bien en una primera impresión solo se distingue el cambio de tamaño del gráfico, contamos con herramientas interactivas tales como zoom-in, zoom-out, arrastrar y exportar el grafico en formato PNG y un pequeño cartel que muestra información acerca del punto. Todo esto simplemente con una sola línea de código, o dos líneas para hacerlo de forma más ordenada

Si bien logramos mejorar muchísimo el aspecto del gráfico, aun no estamos a la altura de un gráfico profesional para presentar en un informe o incluso en nuestra web. Para este ejemplo usaremos la cotización del bono AL30 en dólares, y para no tomarnos el trabajo de diseñar una paleta de colores personalizada, tomaremos como referencia la paleta de una de las empresas de datos más reconocidas en el mercado, Reuters/Refinitiv.

![](/images/2024/plotly-tutorial/1642058524682.png)

Luego de cargar los históricos de las cotizaciones, chequear que los campos están en el formato que deseamos y descartar la existencia de outliers, podemos proceder con el grafico básico.

![](/images/2024/plotly-tutorial/1642060005954.png)

Comenzamos con algo simple, cambiamos el tema del grafico a un color oscuro

![](/images/2024/plotly-tutorial/1642059676288.png)

A continuación, movemos el eje Y hacia la derecha, cambiamos el título a mostrar (Plotly aún no permite rotar el título del eje Y) y cambiamos el paso de las líneas de cuadricula y su color. En cuanto al eje X eliminamos el título a mostrar y cambiamos el color de la cuadricula.

![](/images/2024/plotly-tutorial/1642063066919.png)


Disminuimos el margen, cambiamos el paso del eje X (esto modifica las etiquetas del eje X pero aun no podemos usar etiquetas personalizadas), quitamos parte del margen del gráfico, y cambiamos su color de fondo

![](/images/2024/plotly-tutorial/1642064729621.png)

Hecho todo esto solo nos queda agregar el selector de rango y nos queda un grafico casi idéntico a Reuters.

![](/images/2024/plotly-tutorial/1642065568371.png)

Para los más curiosos el [notebook](https://github.com/franco-lamas/plotly-demo) utilizado y los archivos.
