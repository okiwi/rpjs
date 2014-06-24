describe('Server tests suite:', function () {

    var rpjs;
    var size = 234;

    beforeEach(function () {
        rpjs = new RPJS();

        initRpg(rpjs, size);
    });

    describe('World', function () {
        it('should has a length and height', function () {
            assert.equal(rpjs.getData().width, size);
        });

        it('should add the main player', function () {
            rpjs.setMainPlayer({});

            assert.include(rpjs.getData().players, {});
        });

        describe("given a player", function () {

            beforeEach(function () {
                rpjs.setMainPlayer(new Player("exemple.png", 7, 7, DIRECTION.DOWN));
            });

            it("should move the player", function() {
                var key = 38;
                throwKeyboardEvent(key);

                assert.equal(rpjs.getData().players[0].state.direction, DIRECTION.UP);
            });
        });
    });

    function initRpg(rpjs, size) {
        rpjs.setSize(size, size);
        rpjs.setCanvas({
            style : {},
            getContext: function () {

            }
        });
        rpjs.setMap(new Map(function () {
            return {};
        }));
        rpjs.setup();
    }

    function throwKeyboardEvent(key) {
        var evt = document.createEvent("KeyboardEvent");
        evt.initKeyEvent(
            "keydown",        //  in DOMString typeArg,
            true,             //  in boolean canBubbleArg,
            true,             //  in boolean cancelableArg,
            null,             //  in nsIDOMAbstractView viewArg,  Specifies UIEvent.view. This value may be null.
            false,            //  in boolean ctrlKeyArg,
            false,            //  in boolean altKeyArg,
            false,            //  in boolean shiftKeyArg,
            false,            //  in boolean metaKeyArg,
            key,               //  in unsigned long keyCodeArg,
            0);              //  in unsigned long charCodeArg);
        document.body.dispatchEvent(evt);
    }

});