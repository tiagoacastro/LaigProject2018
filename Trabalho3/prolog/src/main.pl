:- include('board.pl').
:- include('game.pl').
:- include('menu.pl').
:- include('utilities.pl').
:- include('input.pl').
:- use_module(library(random)).

%Beginning of the game
play:-
    mainMenu. 