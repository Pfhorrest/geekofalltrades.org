<?php $title = "The Codex Quaerentis: On Logic and Mathematics &ndash; by Forrest Cameranesi" ?>includes/header-dynamic.php
<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/header-dynamic.php" ?>

				<section>

					<h2>On Logic and Mathematics</h2>
				
					<figure>
						<picture>
							<source srcset="images/philosophy-structure-logic.svg" />
							<source srcset="images/philosophy-structure-logic.png" />
							<img src="images/philosophy-structure-logic.jpg"
								alt="The structure of philosophy, centered on logic" />
						</picture>
					</figure>
					<p>
						Thus far in these essays, I have argued from my <a href="metaphilosophy">metaphilosophy</a> to my general philosophy of <a href="commensurablism">commensurablism</a>, which is any philosophy that is neither <a href="dogmatism">dogmatic</a> nor <a href="cynicism">cynical</a>, and neither <a href="transcendentalism">transcendent</a> nor <a href="relativism">relativist</a>.
					</p>
					<p>
						Then I explored the implications of commensurablism on the <a href="language">philosophy of language</a>, giving an account of both descriptive and prescriptive language that is consistent with its principles.
					</p>
					<p>
						Having since explored the implications of that philosophy of language on <a href="rhetoric">rhetoric and the arts</a>, I will now explore its implications on <strong>logic and mathematics</strong>.
					</p>
					<hr />
					<p>
						Logic is the study of the formal, structural relationships between ideas, or between the linguistic encodings thereof. As elaborated in my previous essay <a href="rhetoric">on rhetoric</a>, I contrast logic with rhetoric as two complementary studies of the use of language: rhetoric as I would characterize it is more artistic, concerning itself with the style and presentation of arguments, and appealing more personally to passions and feelings; while logic is instead more mathematical, concerning itself with the form and structure of arguments, and appealing more impersonally to dispassionate thought.
					</p>
					<p>
						In pursuit of that study of form and structure, logicians create logical or formal systems. These are idealized forms of language that allow the validity of arguments &ndash; the relationships between the statements in those arguments, or the ideas those statements express &ndash; to be examined independent of the truth or meaning of the specifics of those statements, looking only at their form and structure.
						Mathematics, meanwhile, is essentially just the application of such logic: a mathematical object is defined by fiat as whatever obeys some specified rules, and then the logical implications of that definition, and the relationships of those kinds of objects to each other, are explored in the working practice of mathematics.
					</p>
					<section id="mood">
						<h3>On Mood</h3>
						<p>
							The highest-level aspect of my proposed system of logic, and the most original thought I have on the topic, is a direct application of my thoughts <a href="language">on language</a> that I have previously elaborated. I propose the use of a set of functions to indicate the kind of speech-act being made, especially distinguishing the direction-of-fit aspect of it, so that that part of an expression can be separated from the propositional content of the speech-act, the idea that the speech-act is about. This is primarily because all of the rest of logic is about the relationships between those ideas alone, independent of whatever we might be communicating about some attitudes toward those ideas.
						</p>
						<p>
							A classic example of a formal logical inference is that from the propositions "all men are mortal" and "Socrates is a man" we can logically infer the proposition "Socrates is mortal". But, I hold, we could equally well infer from the propositions "all men <em>ought to be</em> mortal" and "Socrates <em>ought to be</em> a man" that "Socrates <em>ought to be</em> mortal".
						</p>
						<p>
							I say that it is really just the ideas of "all men <em>being</em> mortal" and "Socrates <em>being</em> a man" that entail the idea of "Socrates <em>being</em> mortal", and whether we hold descriptive, idea-to-fit-world attitudes about those ideas, or prescriptive, world-to-fit-idea attitudes about them, whether we're impressing or expressing those attitudes, even whether we're making statements or asking questions about them, does not affect the logical relations between the ideas at all.
						</p>
						<figure>
							<picture>
								<source srcset="images/mood-structure.svg" />
								<source srcset="images/mood-structure.png" />
								<img src="images/mood-structure.jpg"
									alt="Structure of Moods" />
							</picture>
						</figure>
						<p>
							So I propose that rather than treating a statement like "All men are mortal" as one proposition and a statement like "All men ought to be mortal" as another, completely unrelated proposition, we instead take the idea that they have in common, "all men being mortal", and wrap that in a function that conveys what we wish to communicate about some attitude toward that idea.
						</p>
						<p>
							For example we might write <code>there-is(all men being mortal)</code> to mean "all men <em>are</em> mortal", and <code>be-there(all men being mortal)</code> to mean "all men <em>ought to be</em> mortal"; and generally, write <code>there-is(S)</code> and <code>be-there(S)</code> for the equivalent descriptive and prescriptive statements about the idea of some state of affairs <code>S</code>, whatever <code>S</code> is.
						</p>
						<p>
							(We might wish to use shorter names for the functions, like simply <code>is()</code> and <code>be()</code>, or some other names entirely; I am merely using the indicative and imperative moods of the copula verb "to be" to capture the descriptive and prescriptive natures of the respective functions.)
						</p>
						<p>
							These as I've written them so far are both implicitly statements and impressions, but we could also use a whole variety of similar functions to differentiate expressions from impressions and questions from statements, for example prepending an exclamation mark or question mark to differentiate statements from questions, as in <code>!there-is()</code> and <code>?there-is()</code>, and prepending, say, a right-bracket for impression or a left-bracket for expression, as in <code>!&gt;there-is()</code> and <code>!&lt;there-is()</code>. We can think of these punctuation marks themselves as unary functions for which we are simply not writing the parentheses, giving us a total of six functions, three pairs of functions:
						</p>
						<ul>
							<li><code>!()</code> and <code>?()</code></li>
							<li><code>&gt;()</code> and <code>&lt;()</code></li>
							<li><code>is()</code> and <code>be()</code></li>
						</ul>
						<p>
							or a total of eight possible combinations thereof:
						</p>
						<ul>
							<li><code>!&gt;is()</code> ("there is..." something)</li>
							<li><code>!&gt;be()</code> ("there should be..." something)</li>
							<li><code>!&lt;is()</code> ("I think there is..." something)</li>
							<li><code>!&lt;be()</code> ("I think there should be..." something)</li>
							<li><code>?&gt;is()</code> ("is there...?" something)</li>
							<li><code>?&gt;be()</code> ("should there be...?" something)</li>
							<li><code>?&lt;is()</code> ("I wonder if there is..." something)</li>
							<li><code>?&lt;be()</code> ("I wonder if there should be..." something)</li>
						</ul>
						<p>
							to indicate the various different things we might wish to communicate about different attitudes toward the same, single, idea. All of the rest of logic can then deal entirely with such ideas, and the relations between them, without concerning itself with what anyone might be communicating about which of the various possible attitudes toward them. I call these kinds of functions "mood" functions, after their similarity to the concept of linguistics moods, such as the indicative and the imperative.
						</p>
						<hr />
						<p>
							The use of these mood functions also facilitates something superficially resembling the motivations for non-classical types of logic such as paraconsistent logics and intuitionist logics, without actually abandoning the principle that differentiates classical logic from them: the principle of bivalence. The principle of bivalence is the principle that every statement must be assigned exactly one of two truth values, "true" or "false", no more and no less. Intuitionist logics allow for statements to be assigned neither of those truth values, while paraconsistent logics allow for statements to be assigned both of them at the same time.
						</p>
						<p>
							With these mood functions, similar things can be constructed without actually violating the principle of bivalance, because there is nothing strictly <em>logically</em> prohibiting it being the case that neither is(P) nor is(not-P), if for example P were some kind of descriptively meaningless statement; it is merely necessary, to preserve bivalance, that either is(P) or not(is(P)), but not(is(P)) doesn't <em>have</em> to entail that is(not-P).
						</p>
						<p>
							Similarly, there is nothing strictly prohibiting it being the case that be(P) and be(not-P), if for example there were some morally intractable situation where both P and not-P were required, and so any outcome was unacceptable; it is merely necessary, to preserve bivalence, that either be(P) or not(be(P)), and be(not-P) doesn't <em>have</em> to entail not(be(P)), so <em>could</em> be compatible with be(P).
						</p>
						<p>
							Fleshing out the philosophical implications of things like descriptively meaningless claims and morally intractable situations is beyond the scope of this particular essay on logic, other than to point out that a logic of this form is in principle capable of discussing things that are, in a sense, "both true and false" or "neither true nor false", without technically violating the principle of bivalence.
						</p>
					</section>
					<section id="mode">
						<h3>On Mode</h3>
						<p>
							The next-highest-level aspect of my proposed logic system is a standard part of many logic systems, but with my own twist on it. It is mode, as in modal logic (not to be confused with mood above). The most common type of modal logic, called alethic modal logic (where <i>alethic</i> is a Greek word meaning pertaining to truth), deals with the concepts of necessity and possibility, and their negations contingency and impossibility.
						</p>
						<p>
							It usually uses two functions, <code>&#x25a1;</code> and <code>&#x25c7;</code>, to represent necessity and possibility, respectively, and negations of them for their negations of course, but either one of those functions is sufficient to represent all of these different modes, because the main two functions of necessity and possibility bear a relationship to each other called De Morgan duality, which just means that each one is equivalent to the negation of the other upon the negation of its argument.
						</p>
						<p>
							To clarify: necessity is the negation of the possibility of a negation; for something to be necessary means that its negation is not possible; it cannot possibly <em>not be</em>, it <em>has to be</em>, and so it definitely actually is. And conversely, possibility is the negation of the necessity of a negation; for something to be possible means that its negation is not necessary; it doesn't <em>have to not be</em>, it <em>could be</em>, even if in fact it actually is not.
						</p>
						<p>
							Thus for something to be contingent, or <em>not</em> necessary, means that its negation <em>is</em> possible; it <em>could</em> not be, even if in fact it actually is. And for something to be impossible, <em>not</em> possible, means that its negation <em>is</em> necessary; it <em>could not</em> be, it <em>has to</em> not be, and so it definitely actually is not.
						</p>
						<p>
							But besides that alethic modal logic, there are also other kinds of modal logic, of particular note, deontic modal logic (where <i>deontic</i> is a Greek word meaning pertaining to duty), which deals with obligation and permission instead of necessity and possibility. Obligation and permission bear the same relations to each other and to goodness as necessity and possibility bear to each other and to truth.
						</p>
						<p>
							Obligation is the negation of the permission of a negation; for something to be obligatory means that its negation is not permissible, it <em>may not</em> not be, it morally <em>must</em> be, and so it definitely should be. Conversely, permission is the negation of the obligation of a negation; for something to be permissible means that its negation is not obligatory; it doesn't morally <em>have to not be</em>, even if maybe it was best if it wasn't and so it still should not be.
						</p>
						<p>
							Thus for something to be omissible, <em>not</em> obligatory, means that its negation <em>is</em> permissible; it <em>may</em> not be, it's morally okay if it's not, even if it would be good if it were. And for something to be impermissible, <em>not</em> permissible, means that its negation <em>is</em> obligatory; it <em>must</em> not be, and so it definitely should not be.
						</p>
						<hr />
						<figure>
							<picture>
								<source srcset="images/modality.svg" />
								<source srcset="images/modality.png" />
								<img src="images/modality.jpg"
									alt="Modality" />
							</picture>
						</figure>
						<p>
							Both alethic and deontic modal logics make possible the expression of subtler ideas than can be expressed with simple black-and-white concepts of truth or goodness, respectively.
						</p>
						<p>
							While something being necessary entails its truth and something being impossible entails its falsehood, something being possible does not entail anything about its truth or falsehood, nor does something being contingent. Possible things might nevertheless be false, and false things nevertheless possible; contingent things might nevertheless be true, and true things nevertheless only contingent; and there are things that are only contingently possible, neither necessary nor impossible, that might be either true or false.
						</p>
						<p>
							Likewise, while something being obligatory entails its goodness and something being impermissible entails its badness, something being permissible does not entail anything about its goodness or badness, nor does something being omissible. Permissible things might nevertheless be bad, and bad things nevertheless permissible; omissible things might nevertheless be good, and good things nevertheless only omissible; and there are things that are only omissibly permissible, neither obligatory nor impermissible, that might be either good or bad.
						</p>
						<p>
							I think that failure to really understand or employ modal logic, as well as logical mood as I've defined it above, is behind a lot of the wrong opinions widely held on quite a lot of different philosophical topics.
						</p>
						<hr />
						<p>
							In traditional deontic modal logic, these obligation and permission functions are usually written with the same <code>&#x25a1;</code> and <code>&#x25c7;</code> operators used in alethic modal logic, their meaning distinguished only by the surrounding context. But under my system of logic, with the mood operators described above, there is no need for that context, because once we have abstracted the descriptiveness or prescriptiveness of statements away into those mood operators, we are dealing only with the raw idea of whatever state of affairs being or not-being in some variety of contexts.
						</p>
						<p>
							The usual semantics given to the alethic modal operators is that of "possible worlds": for something to be necessary is for it to be true in <em>all</em> possible worlds, for it to be possible is for it to be true in <em>some</em> possible worlds, for it to be impossible is for it to be true in <em>no</em> possible worlds, and for it to be contingent is for it to be true in <em>not all</em> possible worlds.
						</p>
						<p>
							If we take those <code>&#x25a1;</code> and <code>&#x25c7;</code> operators to mean not specifically anything about alethic necessity or possibility, nor deontic obligation or permission, but instead as just representing the idea of whatever they are applied to being the case in either all or merely some possible worlds, then when we wrap our descriptive or prescriptive mood functions around them, we automatically get an alethic or deontic logic, both with all the same internal structure.
						</p>
						<p>
							The descriptive mood function asserts that whatever idea being the case in whatever set of possible worlds <em>is true</em>, yielding necessity, possibility, etc; while the prescriptive mood function asserts that it <em>is good</em>, yielding obligation, permission, etc. For something to be obligatory is for the idea of it being the case in all possible worlds to be good; and for something to be permissible is for the idea of it being the case in some possible worlds to be good. For something to be obligatory is for it to be good for that thing to be necessary; and for something to be permissible is for it to be good for that thing to be possible.
						</p>
						<hr />
						<p>
							Furthermore, I propose that we can not only use a single operator to replace both of those <code>&#x25a1;</code> and <code>&#x25c7;</code> operators, but that that single operator can also serve a much broader logical function, and also yield a temporal modal logic, dealing with things being or not being the case differently at different times (which is another traditional kind of modal logic); as well as a spatial modal logic, dealing with things being or not being the case differently at different places. This single operator I propose establishes the scope of contexts wherein a state of affairs is considered to be, and so might be written as something like <code>at()</code>.
						</p>
						<p>
							This function takes two arguments: the first is a set of contexts, such as places, times, or possible worlds, where some state of affairs is considered to be; and the second is the state of affairs itself, e.g. the state of affairs of "all men being mortal". So we might want to talk about, for instance, the idea of all men in Greece specifically being mortal, and so write <code>at(Greece,all men being mortal)</code> to encode that idea. Or if we want to talk about the idea of all men in the past having been mortal, we might write <code>at(the past,all men being mortal)</code> to encode that idea.
						</p>
						<p>
							But most usefully, if that first argument is just the empty set, what you end up encoding is the idea of that state of affairs never, anywhere, at any time, in any possible world, being the case, which is to say, the idea of it being impossible. With that way of talking about something being impossible, we automatically have a way of talking about it being possible, by negating that formula; and of talking about it being necessary, by applying that impossibility function to the negation of the original state of affairs; and of talking about it being contingent, if we negate that formula in turn. Which then yields also functions for impermissibility, permissibility, obligatoriety, and omissibility, if we wrap that idea in a prescriptive mood function rather than a descriptive one.
						</p>
						<p>
							By being more specific about the contexts specified, limiting ourselves to specifying sets of times, we can also say things about some state of affairs being the case at all times or some times or no times, without saying anything about all possible worlds, yielding a temporal modal logic (either an alethic temporal logic or a deontic one depending on what mood function we wrap the idea in). And if we instead limit ourselves to specifying sets of places, we can say things about some state of affairs being the case everywhere or somewhere or nowhere, likewise yielding a spatial modal logic (and again, either an alethic or deontic one, as we like).
						</p>
						<p>
							With our mood functions allowing us to instead express rather than impress these ideas, we can also easily create things like a doxastic or epistemic modal logic, having to do with things like belief and certainty rather than truth and necessity.
						</p>
						<p>
							And lastly, by specifying some fraction of possible worlds, or times, or places, this function can also serve to encode statements about probability, to say talk about things being likely or unlikely (which is to say, them being the case in many or few possible worlds) rather than strictly necessary or impossible (the case in all or no possible worlds); or, combined with the temporal or spatial possibilities, to talk about things being the case most of the time, most places, etc. The possible modal ideas expressible with this one <code>at()</code> function (plus the mood functions above) vastly outnumber those expressible with the traditional <code>&#x25a1;</code> and <code>&#x25c7;</code> functions.
						</p>
					</section>
					<section id="quantification">
						<h3>On Quantification</h3>
						<p>
							The next-highest-level aspect in my proposed logic system deals with the topic that the oldest of logic systems were created to deal with: quantification of variables in logical formulae. This was the topic dealt with in Aristotle's original logic system, but it has since been greatly refined.
						</p>
						<p>
							Aristotle's logic laid out explicit lists of which of forms of arguments, or syllogisms, each involving two statements either about all, some, none, or not all members of one category being in another category (e.g. "all men are mortal"), or about specific individuals being in categories (e.g. "Socrates is a man"), were valid or invalid. This captured much of the intuitive sense of logic people have in common discourse, but it had some major problems that have since been remedied.
						</p>
						<hr />
						<figure>
							<picture>
								<source srcset="images/quantification.svg" />
								<source srcset="images/quantification.png" />
								<img src="images/quantification.jpg"
									alt="Quantification" />
							</picture>
						</figure>
						<p>
							One of them was an asymmetry in the way "all" statements were treated: in natural discourse, and in Aristotle's system of logic, to say something about all members of some set implies that there are <em>some</em> members of that set. But that asymmetry makes it impossible to completely translate statements about all (or not all) members of some set into statements about some (or not some, i.e. none) of the members of a set.
						</p>
						<p>
							In natural discourse it's clear that if all A are B, then there must be no A that are non-B. Likewise, if not all A are B, then there must be some A that are non-B. And if some A are B, then not all A are non-B. But under Aristotelian logic, and in natural discourse, it does not follow that if no A are B, then all A are non-B, because it might just be the case that there are no A at all, in which case any "no A..." statement is true, but any "all A..." statement is false, because any "all A..." statement implies (by this old logic) a "some A..." statement that must be false if there are no A.
						</p>
						<p>
							In contrast, modern systems of logic bite that counterintuitive bullet for the sake of clearer, more workable logical functions, and say that "all A are B" is just exactly equivalent to "no A are non-B", so if there are no A, then any "all A are B" statement is true, but in a trivial way that doesn't mean quite what we naturally want to take it to mean (that there are some A, none of which are B). This makes "all..." and "some..." functions once again De Morgan dual, just like the two traditional modal operators discussed above.
						</p>
						<hr />
						<p>
							Another major problem with Aristotelian logic that has since been remedied is the problem of statements involving some mix of "all" (or "every") and "some" statements, such as "every mouse is afraid of some cat". There are two different things that that statement might mean, and Aristotelian logic is unable to distinguish between them: it might mean that for every mouse, there is some cat or another that that particular mouse is afraid of, maybe a different cat for every mouse; or it might mean that there is some particular cat of whom every mouse is afraid, that same one cat frightening every single mouse.
						</p>
						<p>
							Treating these interpretations as equivalent is behind some major philosophical fallacies of the past: for instance, it would lead one to infer from the premise that everything comes from something (which is to say that for each thing, there is some thing or another from which that thing came, but maybe a different origin for each thing) to the conclusion that there is something from which everything comes (which is to say that there is one particular thing from which all other things came, a singular common origin to everything).
						</p>
						<p>
							Thankfully that too has already been remedied in contemporary systems of logic, in which two functions are used, <code>&forall;</code> and <code>&exist;</code>, which are usually read aloud as "for all..." (or sometimes "for every...") and "there exists some...". These functions turn statements that would otherwise be about individual things into statements about categories of things, by using a variable as the subject of an ordinary statement seemingly about an individual thing, and then quantifying how many values of that variable satisfy the truth of such a statement.
						</p>
						<p>
							For example, "all men are mortal" would be written <code>&forall;m(if m is a man then m is mortal)</code> and read as "for all m, if m is a man then m is mortal", while "some men are Greek" would be written as <code>&exist;m(m is a man and m is Greek)</code> and read as "there exists some m such than m is a man and m is Greek".
						</p>
						<p>
							Statements involving both "all" and "some" functions can then be clarified as to which of their two possible interpretations is meant, by the order in which these functions are used: <code>&forall;mouse&exist;cat(the mouse fears the cat)</code> means "for every mouse there exists some cat such that the mouse fears the cat" (i.e. each mouse has some cat or another that it's afraid of, but they might all be different cats), whereas <code>&exist;cat&forall;mouse(the mouse fears the cat)</code> means "there exists some cat such that for every mouse, the mouse fears the cat" (i.e. there is one particular cat of whom all mice are afraid).
						</p>
						<p>
							Likewise, the sense of "everything comes from something" that means each thing has some origin or another would be written as <code>&forall;thing&exist;other-thing(the thing comes from the other-thing)</code>, while the sense that means there is some particular thing that is the origin of everything else would be written <code>&exist;other-thing&forall;thing(the thing comes from the other-thing)</code>, and the two are not logically equivalent.
						</p>
						<hr />
						<p>
							The manner of reading the <code>&exist;</code> symbol aloud is the first change to this aspect of logic that I propose, because I think it implies unnecessary assumptions or at least raises unnecessary questions about the <em>existence</em> of things in a more robust sense than this logical function strictly implies, questions that I will address later in this essay. I think a much better reading of the <code>&exist;</code> function is simply "for some...", rather than "there exists some...".
						</p>
						<p>
							Both functions, <code>&exist;</code> and <code>&forall;</code>, only specify how many values of the variable they quantify make the statement that follows true, and the statement doesn't necessarily have to be asserting the existence of anything, so saying that there <em>exists</em> some <em>thing</em> goes beyond what this function really does; <code>&exist;</code> merely says that some <em>value</em> of the variable <em>satisfies</em> the following formula, just like <code>&forall;</code> merely says that <em>any</em> value of that variable satisfies the formula. Furthermore, with both functions being read as "for..." something, we can also more easily implement my next proposal, which is that we can once again make do with just one function to handle this entire aspect of logic and more besides that.
						</p>
						<p>
							I propose a <code>for()</code> function that takes three arguments, the first being a set of values that some variable can take to satisfy some formula, the second being that variable, and the third being that formula. (This would then be read as "for [these values of] [this variable], [this statement involving that variable is true]").
						</p>
						<p>
							This replicates some of functionality of another function frequently used together with the traditional quantification operators, <code>&isin;</code>, which properly indicates that whatever is on the left of it is a member of the set on the right of it, but together with the existential operators is often used to write things like <code>&forall;x&isin;S...</code>, meaning "for every x in set S...", meaning that only the members of S satisfy the formula to follow. Expressions like the usual <code>&exist;x&isin;S...</code> (meaning "for some x in set S...") can also be formed, with this function, by using the equivalent of an "or" function, as I will describe below, on the set in the first argument of <code>for()</code>, to yield an expression meaning "some of this set".
						</p>
						<p>
							And once again, like with the single operator I proposed for all modal logic above, if the first argument is the empty set, we are left with a special case of this function meaning "for no...", which we can then easily turn into "for some..." by negation, and then turn those two into "for all..." and "for not all..." by applying them to the negations of the formula in the third argument.
						</p>
						<p>
							E.g. negating "for no m, if m is a man then m is mortal", meaning "no men are mortal", gives us "for some m, if m is a man then m is mortal", meaning "some men are mortal"; while "for no m is it not the case that if m is a man then m is mortal" means "for all m, if m is a man then m is mortal", or in other words "all men are mortal"; and "for some m, it is not the case that if m is a man then m is mortal", in other words "some men are not mortal", of course means the same thing as "for not all m, if m is a man then m is mortal", or in other words, "not all men are mortal".
						</p>
					</section>
					<section id="predication">
						<h3>On Predication</h3>
						<p>
							The contemporary quantification functions were introduced hand-in-hand with the next aspect of logic I am going to discuss, predication functions, more commonly called propositional functions. A predicate is basically the rest of a proposition after the subject. For example, in "all men are mortal", "are mortal" is the predicate, while "all men" is the subject; and in "Socrates is a man", "Socrates" is the subject, and "is a man" is the predicate. The predicate is basically what a proposition is saying <em>about</em> the subject. Predicating something of a subject is usually taken as equivalent to saying that that thing is a member of some set, the set of all things that predicate is true of.
						</p>
						<p>
							In contemporary predicate logic, the predicate is treated as a logical function, called the propositional function, and the subject of that predicate treated as its argument: the function upon that argument then yields a specific proposition. For example, the proposition "Socrates is mortal" might be decomposed into the function <code>is-mortal()</code> which indicates that whatever is put into it is mortal, and the subject <code>Socrates</code>, such that <code>is-mortal(Socrates)</code> means "Socrates is mortal". This can then be combined with the quantification functions already discussed above, to encode a proposition like "all men are mortal" as <code>&forall;m(if is-man(m) then is-mortal(m))</code>.
						</p>
						<hr />
						<figure>
							<picture>
								<source srcset="images/predication.svg" />
								<source srcset="images/predication.png" />
								<img src="images/predication.jpg"
									alt="Predication" />
							</picture>
						</figure>
						<p>
							My proposal for improving this aspect of logic is the use of a single function to handle predicating membership in any set of any subject, a function that is also capable of predicating a fuzzy, non-binary degree of membership, thus allowing the expression of ideas appropriate to fuzzy logic, which deals with sets to which individuals can be members in degrees somewhere between fully members and not at all members.
						</p>
						<p>
							This is similar to simply separating the <code>is</code> out from those <code>is-something()</code> functions described above, but because in my entire system of logic we are dealing with ideas independently of the different kinds of attitudes we might have toward them, we want to encode not the idea that e.g. Socrates <em>is</em> mortal, any more than we want to encode the idea that Socrates <em>ought to be</em> mortal, but rather just the idea of Socrates <em>being</em> mortal.
						</p>
						<p>
							So the function I propose is <code>being()</code>, and it again takes three functions: the first is a number from zero to one expressing the degree of membership in some set to be predicated of some subject, the second is the set to which that degree of membership is to be predicated, and the third is the subject of which it is to be predicated.
						</p>
						<p>
							So for example to encode the idea of Socrates being entirely mortal (and noting for ease of reading here that <code>x%</code> is an equivalent way of writing <code>x/100</code>, so 100% = 1 and 50% = 0.5), we might write <code>being(100%,mortal,Socrates)</code>; while if we wanted to instead encode the idea of e.g. Hercules being only half-mortal (whatever that might mean), we might instead write <code>being(50%,mortal,Hercules)</code>.
						</p>
						<p>
							(In an ideal constructed language, I think those sets would best be principally specified in terms of the output or input of functions, basically as either active or passive verbs, e.g. <code>being(100%,verbing,subject)</code> or <code>being(100%,verbed,subject)</code>; with adjectives being formed by inflection to indicate propensity to <code>verb</code> or to <code>be-verbed</code>, e.g. <code>being(100%,verby,subject)</code> or <code>being(100%,verbable,subject)</code>; and nouns formed similarly, e.g. <code>being(100%,verber,subject)</code> or <code>being(100%,verbee,subject)</code>).
						</p>
					</section>
					<section id="connection">
						<h3>On Connection</h3>
						<figure>
							<picture>
								<source srcset="images/connection.svg" />
								<source srcset="images/connection.png" />
								<img src="images/connection.jpg"
									alt="Connection" />
							</picture>
						</figure>
						<p>
							The final aspect of logic that I have yet to discuss is the most basic and fundamental aspect of it, the usual topic of any introductory course on logic: the logical connectives like "and", "or", "not", "if-then", and so forth. It is already well-known in contemporary logic that these connectives can be readily converted between each other; for example, conjunction ("and") and disjunction ("or") are once again De Morgan duals, where the negation of a conjunction ("not (A and B)") is equivalent to the disjunction of negations ("not-A or not-B"), and conversely the negation of a disjunction ("not (A or B)") is equivalent to the conjunction of negations ("not-A and not-B").
						</p>
						<figure>
							<picture>
								<source srcset="images/boolean-junctions.svg" />
								<source srcset="images/boolean-junctions.png" />
								<img src="images/boolean-junctions.jpg"
									alt="Boolean Junctions" />
							</picture>
						</figure>
						<p>
							Implication ("if A then B" or "A only if B") in turn is equivalent to a certain kind of conjunction ("not (A and not-B)") which is likewise equivalent to another kind of disjunction ("not-A or B"); the reverse of implication ("A if B"), which I like to call "explication", is likewise equivalent to that conjunction and that disjunction with the negations of their terms likewise reversed ("not(not-A and B)" or "A or not-B").
						</p>
						<p>
							Bi-implication ("A if and only if B"), which I like to call "complication" (meaning "bending together", as "implication" means "bending into" and "explication" means "bending out of"), is of course the conjunction of both implication and explication; and what's usually called "exclusive disjunction" ("A xor B"), which I prefer to call "displication" (meaning "bending apart"), is the negation of that.
						</p>
						<p>
							There are still other, much less used, logical functions for saying which if either of two things must or must not be the case together for the entire state of affairs thus encoded to be the case, but the two most important ones are usually called "alternative denial" ("A nand B") and "joint denial" ("A nor B"), though I prefer to call them "disnegation" (meaning "negating apart") and "conegation" (meaning "negating together"). These two functions are important because either one of them can serve as a sole sufficient operator to build any of these functions I have just described, and the equally-many lesser-used ones I haven't even bothered to describe here.
						</p>
						<hr />
						<p>
							Besides a few new names and symbols above, my main proposal for improvement in this aspect of logic is the introduction of yet another single, broader function that can serve in place of all of these other functions. I call it the "junction" function, after functions like conjunction and disjunction, but I write it <code>of()</code>, because it takes two arguments, a number and a set, and returns that number of members <em>of</em> that set, and so can be used to mean things like "none of...", "some of...", "all of...", etc. If the number in the first argument is zero, it returns no members of that set, and so is equivalent to the conegation, or joint denial, of all members of that set. That can then be used to construct any of the other functions just like a traditional joint denial function can.
						</p>
						<p>
							The conegation of a single item is just that item's negation, so this serves straightforwardly in place of "not". The negation of a conegation of several things is equivalent to the disjunction of those several things, i.e. "not (neither A nor B nor C ...)" just means "A or B or C ...", so we have replicated the functionality of "or".
						</p>
						<p>
							The conegation of the negations of several things is equivalent to the conjunction of those several things, i.e. "neither not-A nor not-B nor not-C ..." just means "A and B and C ...", so we have replicated the functionality of "and". And the negation of such a conjunction is a disnegation, or alternative denial, i.e. "not (neither not-A nor not-B nor not-C ...)" just means "A nand B nand C ...", so we have replicated the functionality of "nand".
						</p>
						<p>
							And so on with all those we can replicate the functionality of implication, explication, complication, displication, and the rest of the connectives.
						</p>
						<p>
							With this <code>of()</code> function we can talk about complex sets of things, as all of the connectives are equivalent to set operations: disjunction is equivalent to the union of sets (the set of things that are A or B is the set of things in the union of set A and set B), conjunction is equivalent to the intersection of sets (the set of things that are A and B is the set of things in the intersection of set A and set B), and so on.
						</p>
					</section>
					<section id="mathematics">
						<h3>On Mathematics</h3>
						<p>
							This talk of sets segues directly into mathematics. To most lay people, mathematics is the study of numbers, but to actual mathematicians and philosophers of mathematics, mathematics is the study of a broad variety of things besides numbers including all manner of abstract structures, both in and of themselves and specifically in space and in time.
							</p>
							<p>
							Mathematics is essentially just the application of pure logic: a mathematical object is defined by fiat as whatever obeys some specified rules, and then the logical implications of that definition, and the relations of those kinds of objects to each other, are explored in the working practice of mathematics. Numbers are just one such kind of objects, and there are many others; but in contemporary mathematics, all of those structures have since been grounded in sets.
						</p>
						<p>
							The natural numbers, for instance, meaning the counting numbers {0, 1, 2, 3, ...}, are easily defined in terms of sets. First we define a series of sets, starting with the empty set, and then a set that only contains that one empty set, and then a set that only contains those two preceding sets, and then a set that contains only those three preceding sets, and so on, at each step of the series defining the next set as the union of the previous set and a set containing only that previous set. We can then define some set operations (which I won't detail here) that relate those sets in that series to each other in the same way that the arithmetic operations of addition and multiplication relate natural numbers to each other.
						</p>
						<p>
							We <em>could</em> name those sets and those operations however we like, but if we name the series of sets "zero", "one", "two", "three", and so on, and name those operations "addition" and "multiplication", then when we talk about those operations on that series of sets, there is no way to tell if we are just talking about some made-up operations on a made-up series of sets, or if we were talking about actual addition and multiplication on actual natural numbers: all of the same things would be necessarily true in both cases, e.g. doing the set operation we called "addition" on the set we called "two" and another copy of that set called "two" creates the set that we called "four".
						</p>
						<p>
							Because these sets and these operations on them are fundamentally indistinguishable from addition and multiplication on numbers, they are functionally identical: those operations on those sets <em>just are the same thing as</em> addition and multiplication on the natural numbers.
						</p>
						<p>
							All kinds of mathematical structures, by which I don't just mean a whole lot of different mathematical structures but <em>literally every</em> mathematical structure studied in mathematics today, can be built up out of sets this way. The integers, or whole numbers, can be built out of the natural numbers (which are built out of sets) as equivalence classes (a kind of set) of ordered pairs (a kind of set) of natural numbers, meaning in short that each integer is identical to some set of equivalent sets of two natural numbers in order, those sets of two natural numbers in order that are equal when one is subtracted from the other: the integers are all the things you can get by subtracting one  natural number from another.
						</p>
						<p>
							Similarly, the rational numbers can be defined as equivalence classes of ordered pairs of integers in a way that means that the rationals are the things you can get by dividing one integer by another. The real numbers, including irrational numbers like pi and the square root of 2, can be constructed out of sets of rational numbers in a process too complicated to detail here (something called a Dedekind-complete ordered field, where a field is itself a kind of set). The complex numbers, including things like the square root of negative one, can be constructed out of ordered pairs of real numbers.
						</p>
						<p>
							And further hypercomplex numbers, including things called quaternions and octonions, can be built out of larger ordered sets of real numbers, which are built out of complicated sets of rational numbers, which are built out of sets of integers, which are built out of sets of natural numbers, which are built out of sets built out of sets of just the empty set. So from nothing but the empty set, we can build up to all complicated manner of fancy numbers.
						</p>
						<p>
							But it is not just numbers that can be built out of sets. For example, all manner of geometric objects are also built out of sets as well. All abstract geometric objects can be reduced to sets of abstract geometric points, and a kind of function called a coordinate system maps such sets of points onto sets of numbers in a one-to-one manner, which is hence reversible: a coordinate system can be seen as turning sets of numbers into sets of points as well.
						</p>
						<p>
							For example, the set of real numbers can be mapped onto the usual kind of straight, continuous line considered in elementary geometry, and so the real numbers can be considered to form such a line; similarly, the complex numbers can be considered to form a flat, continuous plane.
							Different coordinate systems can map different numbers to different points without changing any features of the resulting geometric object, so the points, of which all geometric objects are built, can be considered the equivalence classes (a kind of set) of all the numbers (also made of sets) that any possible coordinate system could map to them, and so all geometric objects can also in principle be built from sets.
						</p>
					</section>

					<hr />

					<p><strong>Continue to the next essay, <a href="ontology">On Ontology, Existence, and the Objects of Reality</a>.</strong></p>

				</section>

<?php require $_SERVER['DOCUMENT_ROOT'] . "/includes/footer-global.php" ?>
