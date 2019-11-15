angular.module('app', [])
        .directive('dragGable', function ($document) {
            return function (scope, element, attr) {
                console.log($document);
                console.log(scope);
                console.log(element);
                console.log(attr);

                let startX = 0,
                    startY = 0,
                    x = 0,
                    y = 0;

                element.css({
                    position: 'relative',
                    border: '1px solid red',
                    backgroundColor: 'lightgrey',
                    cursor: 'pointer'
                });

                element.on('mousedown', function (event) {
                    console.log(event);
                    event.preventDefault();
                    startX = event.screenX - x;
                    startY = event.screenY - y;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });

                function mousemove(event) {
                    y = event.screenY - startY;
                    x = event.screenX - startX;
                    element.css({
                        top: y + 'px',
                        left:  x + 'px'
                    });
                }

                function mouseup() {
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            }
        });