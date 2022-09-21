function component() {
  const El = document.createElement('div');

  El.innerHTML = ['webpack', 'javascript'].join(' ');
  El.className = 'content';
  return El;
}

document.body.appendChild(component());
