---
title: "Battlecode 2026"
description: "How we reached finals as first time participants with zero Battlecode knowledge."
date: 2026-2-5
---

## Introduction

Battlecode is a programming competition ran by students at MIT. Competitors compete to develop the best game playing algorithm over a month long period.

This year, I lead my team `3MiceWalkIntoABar` through U.S. Qualifiers into finals. Even though we were knocked out rather quickly in the finals tournament, I'm still extremely proud of where we managed to reach. Our time is made of entirely freshmen competing in Battlecode for the first time. (Paul doesn't even code)

This is a postmortem about our experience, things we tried that worked well, and how to avoid mistakes we made in the future.

If you didn't particpate this year or want an explanation on this year's game, you should read this [brief introduction](./the-game.md).

You can also check out our bot's source code [here](https://github.com/outercloudstudio/battlecode-2026).

<div style="height: 30px;"></div>

![Photograph of Team 3MiceWalkIntoABar at the Battlecode 2026 Finals](./us.jpg)

<div style="max-width: 30rem; margin: auto auto">This is our team at finals this year. It's not the best picture but you can't see me in any of the other pictures taken TᴖT. In order from left to right: Richard Xun, Liam Hanrahan (Me), Paul Fang Li, Armaan Gomes</div>

<div style="height: 40px;"></div>

## Table of Contents
1. [Sprint 1](./#sprint-1)
2. [Sprint 2](./#sprint-2)
3. [US Qualifiers](./#us-qualifiers)
4. [Final Tournament](./#final-tournament)
5. [Pathfinding](./#pathfinding)
6. [Combat Micro](./#combat-micro)
7. [Communication](./#communication)
8. [Economy](./#economy)
9. [King Macro](./#king-macro)
10. [King Micro](./#king-micro)
11. [Dealing With Cats](./#dealing-with-cats)
12. [Reflection](./#reflection)

## Sprint 1
During sprint 1 we worked on establishing a good foundation for our bot. This included setting up the important systems like pathfinding, communication, combat micro, and basic economy. Throughout the competition, we worked on improving these primatives, but our bot remained very similar foundationally to how we structured it during sprint 1.

Once the ranked leaderboard opened after a few days, we remained consistently in or near the top 10 teams. For a while at the beginning we hovered from 4th-7th place.

<div style="height: 10px;"></div>

![3MiceWalkIntoABar at 8th place on the ranked leaderboard](./sprint-1-leaderboard.png)

<div style="height: 10px;"></div>

One strategy that was especially powerful during sprint 1 was a full rush. Many teams did not have strong enough micro to counter and the sprint 1 maps were all rather open and rotationally symmetric. This was curbed later with more complicated maps and better defense.

### State Machine
Behaviour within our bot was handled with an extremely simple state machine. Essentially, every tick a rat would check which state was stored within the `state` variable and execute code for that state. We also stored a `previousState` which could allow the bot to remember and later resume a state if it got interrupted by the `fleeingCat` state. Looking back while writing this I realize we could have very easily made this a switch statement and saved some bytecode.

Here's what it looks like:

```java
public class BabyController {
    public static String state = "locateCheese";
    public static String previousState = "locateCheese";

    private static void goToState(String newState) throws GameActionException {
        state = newState;
        previousState = newState;

        // run any code that should happen when newState is entered
        // ...
    }

    private static void goToStateTemporary(String newState) throws GameActionException {
        state = newState;

        // run any code that should happen when newState is entered
        // ...
    }

    public static void run(RobotController rc) throws GameActionException {
        while(true) {
            if (state.equals("locateCheese")) {
                if(rc.getRawCheese() > 0) {
                        goToState("returnCheese");
                }

                // ...
            }
        }
    }
}
```

### Economy
We experimented with various different economy strategies during sprint 1. Initially rats would begin in the `explore` state. In this state they would pick random locations on the map to travel to. Once they saw a cheese mine, they would enter the `communicateCheeseMineState`. In this state, rats would run back to the king and squeak the cheese mine. (More on communications later) Then, the rat would then locate, collect, and return cheese using the `locateCheese`, `pickupCheese`, and `returnCheese` states. Rats would also try to collect multiple cheese before returning.

Later after analyzing games we realized that we were losing out on cheese by keeping locating mines and collecting cheese as seperate behaviours. So, we combined them and it helped collect cheese a bit faster. We also observed that some of the top teams were not collecting multiple cheeses. We ended making this change and then never investigating it later.

### Pathfinding
Pathfinding actually remained almost unchanged after sprint 1, except for tweaks to bugnav at the very end before U.S. qualifiers.

Our pathfinding began by running a [Breadth First Search](https://en.wikipedia.org/wiki/Breadth-first_search) expansion on adjacent nodes originating at the rat. This was repeated 25 times, essentially expanding the search to 25 tiles. Every expansion marked the cell it expanded with an integer that increased for each iteration. We also tracked and updated which expanded cell was closes to the target location. Then, after expansion we found the path from this closest cell back to the rat by at every step, picking the tile with the lowest number until eventually we reached back to the rat.

Normally expansion would cost an unreasonable amount of bytcode, however I came up with an optimization early on that allowed us to do this with no code generation. Essentially, whenever a rat sees a obstacle like a wall, it records this obstacle into a `Map` structure. This structure is an array of `chars`, but what's important is we have a list of essentially groups of bits which we can look up based on a tile's position. Instead of simply storing if the tile was passible, we can store passability to other tiles. Here's what each bit represents:
0. Is this tile impassable
1. Is the tile to the `North` impassable
2. Is the tile to the `East` impassable
3. Is the tile to the `West` impassable
4. Is the tile to the `South` impassable

Then, in expansion we can do a switch over this `char`. This saves a lot of bytcode because it doesn't check the map during expansion, and we don't need to do seperate if statements or map reads for the different directions.

If this `Breadth First Search` failed because it couldn't find a better move, the rat would fall back to a stupid weird bugnav pathfinding I wrote on the first day. This was eventually changed out for `bugnav 0` before U.S. Qualifiers.

<span class="newsreader">A note on king pathfinding:</span> At first glance pathfinding a 3x3 unit might seem significantly more complex, however we can use the same exact pathfinding code for the king. The only thing we need to change is how we store obstacles. Whenver the king sensed an impassable obstacle, it would mark down a 3x3 location centered on the obstacle as impassable into the map structure.

<span class="newsreader">Temporary obstacles:</span> More on how we dealt with nonpermanent obstacles such as dirt and units later.

### Cats
During sprint 1, cats were extremely broken. They were super aggressive, but would also often brick next to a wall and get stuck there. We used two strategies to mitigate cats. First, if a rat saw a cat, it would run at half speed in the opposite direction of the king while squeaking. The idea here was to attempt to lead the cat to the other team's king and hope that it would disrupt their side. In retrospect I don't think this ever worked very well since the cats were too unpredictable and rats were easily disrupted by enemies. 

Our second strategy was to try and detect if a cat had gotten stuck on a wall. If a rat noticed that it was fleeing multiple times from the same cat who had not moved, it would treat the cat and it's neighboring tiles as an impassable wall and then otherwise ignore the cat. This did help a bit to mitigate economic disruption from a cat bricking on your side and preventing rats from returning to the king.

### Communications

## Sprint 2

## US Qualifiers

## Final Tournament

## Combat Micro

## Communication

## Economy

## King Macro

## King Micro

## Dealing With Cats

## Reflections

<div style="height: 60px;"></div>