use strict;
use warnings;

# Converts rocco-generated HTML for side-by-side tutorials into something that
# is (much) easier to maintain by hand.
#
# Usage: perl unrocco.pl < old_and_busted.html > new_hotness.md
#
# Note: Code samples in the output file will need to be manually re-indented.

my $incode = 0;

while (<STDIN>) {
	if ($incode) {
		if (/<\/div>/) {
			print "```\n</div>\n";
			$incode = 0;
		} else {
			print unhtml($_);
		}
	} elsif (/<div class="highlight">/) {
		print "<div class=\"highlight\" markdown=\"1\">\n```javascript\n";
		$incode = 1;
	} else {
		print;
	}
}

sub unhtml {
	my $s = $_[0];
	$s =~ s/<[^>]+>//g;
	$s =~ s/&quot;/"/g;
	$s =~ s/&#39;/'/g;
	$s =~ s/&amp;/&/g;
	return $s;
}
