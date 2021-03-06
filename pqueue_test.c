#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include "pqueue.h"

#define TEST_CASES 4

struct element {
	double priority;
	int value;
};

int main(void)
{
	struct element input[TEST_CASES] = {{3.0, 1}, {1.0, 2}, {2.0, 3}, {3.0, 4}};
	struct element expected_output[TEST_CASES] = {{1.0, 2}, {2.0, 3}, {3.0, 1}, {3.0, 4}};
	int i, value;
	double priority;
	struct pqueue *queue;
	
	queue = pqueue_new();

	/*insert elements*/
	for (i = 0; i < TEST_CASES;  i++) {
		pqueue_insert(input[i].value, input[i].priority, queue);
	}
	
	/*remove elements*/
	for (i = 0; i < TEST_CASES; i++) {
		pqueue_remove(queue, &value, &priority);
		assert((value == expected_output[i].value) && (priority == expected_output[i].priority));
	}
	
	pqueue_delete(queue);
				
	return 0;	
}
